#!/usr/bin/env python3
"""
Замъгляване на лица в снимки за публичния сайт.

  python3 blur_faces.py ВХОДНА_ПАПКА ИЗХОДНА_ПАПКА [--strength 1.0] [--preview]

- Открива лицата с модела BlazeFace (full range) – и в цялата снимка, и на припокриващи се
  парчета, за да хване и малките лица в групови снимки.
- Замъглява само лицата с мека елипса (без резки ръбове), останалото не се пипа.
- Записва JPG (за архив) и WebP 1600 px (за сайта); метаданните (GPS и др.) се премахват.
- С --preview записва и контролно копие с рамки около откритите лица.
- Ръчни поправки: файл manual.json до снимките, напр.
    {"IMG_1.jpg": {"add": [[x, y, w, h]], "keep": [[x, y, w, h]], "skip": false}}
  add – допълнително замъгляване; keep – област, която да остане ясна (напр. моето лице);
  skip – снимката да не се пипа.
  (координати в пиксели от оригинала).
"""
import json, sys, argparse
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFilter
from ai_edge_litert.interpreter import Interpreter

MODEL = Path(__file__).parent / 'models' / 'face_detection_full_range.tflite'
SIZE = 192

_interp = Interpreter(str(MODEL))
_interp.allocate_tensors()
_in = _interp.get_input_details()[0]['index']
_outs = sorted(_interp.get_output_details(), key=lambda o: o['shape'][-1], reverse=True)

# 48 x 48 котви с отместване 0.5 (BlazeFace full range: stride 4, 1 котва на клетка)
g = (np.arange(48) + 0.5) / 48
ANCH = np.stack(np.meshgrid(g, g), -1).reshape(-1, 2)  # (x, y)


def _detect_square(img, thr):
    """img: PIL RGB квадрат -> списък (x0,y0,x1,y1,score) в относителни координати 0..1"""
    a = np.asarray(img.resize((SIZE, SIZE), Image.BILINEAR), dtype=np.float32) / 127.5 - 1.0
    _interp.set_tensor(_in, a[None])
    _interp.invoke()
    reg = _interp.get_tensor(_outs[0]['index'])[0]
    sc = 1 / (1 + np.exp(-np.clip(_interp.get_tensor(_outs[1]['index'])[0, :, 0], -100, 100)))
    out = []
    for i in np.where(sc > thr)[0]:
        cx = reg[i, 0] / SIZE + ANCH[i, 0]
        cy = reg[i, 1] / SIZE + ANCH[i, 1]
        w, h = reg[i, 2] / SIZE, reg[i, 3] / SIZE
        out.append((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, float(sc[i])))
    return out


def _run_on_region(im, box, thr):
    """Пуска модела върху правоъгълник от снимката (вписан в квадрат) и връща абсолютни кутии."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    s = max(w, h)
    sq = Image.new('RGB', (s, s), (0, 0, 0))
    sq.paste(im.crop(box), (0, 0))
    res = []
    for a, b, c, d, sc in _detect_square(sq, thr):
        bx0, by0, bx1, by1 = x0 + a * s, y0 + b * s, x0 + c * s, y0 + d * s
        if bx1 - bx0 < 4:
            continue
        res.append((bx0, by0, bx1, by1, sc))
    return res


def _nms(boxes, iou=0.3):
    boxes = sorted(boxes, key=lambda b: -b[4])
    keep = []
    for b in boxes:
        ok = True
        for k in keep:
            ix = max(0, min(b[2], k[2]) - max(b[0], k[0]))
            iy = max(0, min(b[3], k[3]) - max(b[1], k[1]))
            inter = ix * iy
            a1 = (b[2] - b[0]) * (b[3] - b[1])
            a2 = (k[2] - k[0]) * (k[3] - k[1])
            if inter / (a1 + a2 - inter + 1e-9) > iou or inter / min(a1, a2) > 0.6:
                ok = False
                break
        if ok:
            keep.append(b)
    return keep


def _profiles(im):
    """Допълнително търсене на лица в профил (OpenCV), в двете посоки."""
    try:
        import cv2
    except ImportError:
        return []
    casc = cv2.CascadeClassifier(str(Path(__file__).parent / 'models' / 'haarcascade_profileface.xml'))
    if casc.empty():
        return []
    g = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2GRAY)
    W = g.shape[1]
    ms = max(18, W // 80)
    res = []
    for flip in (False, True):
        gg = cv2.flip(g, 1) if flip else g
        for x, y, w, h in casc.detectMultiScale(gg, 1.08, 5, minSize=(ms, ms)):
            if flip:
                x = W - x - w
            res.append((float(x), float(y), float(x + w), float(y + h), 0.45))
    return res


def detect(im, thr=0.5):
    W, H = im.size
    boxes = _run_on_region(im, (0, 0, W, H), thr) + _profiles(im)
    # парчета: 2x2 и 3x3 с припокриване – за малки лица
    for n in (2, 3, 4):
        tw, th = W / n * 1.35, H / n * 1.35
        for i in range(n):
            for j in range(n):
                cx, cy = (i + 0.5) * W / n, (j + 0.5) * H / n
                box = (int(max(0, cx - tw / 2)), int(max(0, cy - th / 2)), int(min(W, cx + tw / 2)), int(min(H, cy + th / 2)))
                boxes += _run_on_region(im, box, thr)
    return _nms(boxes)


def blur(im, boxes, strength=1.0):
    W, H = im.size
    out = im.copy()
    mask = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mask)
    maxside = 0
    minh = 1e9
    for x0, y0, x1, y1, *_ in boxes:
        w, h = x1 - x0, y1 - y0
        # разширяване: коса, чело, брадичка
        ex0, ey0 = x0 - w * 0.28, y0 - h * 0.45
        ex1, ey1 = x1 + w * 0.28, y1 + h * 0.25
        d.ellipse([ex0, ey0, ex1, ey1], fill=255)
        maxside = max(maxside, w)
        minh = min(minh, h)
    if not boxes:
        return out
    radius = max(6, int(float(min(maxside, 4 * minh)) * 0.35 * strength))
    # пикселизация + размиване = не може да се „възстанови“
    small = im.resize((max(1, W // max(4, radius // 2)), max(1, H // max(4, radius // 2))), Image.BILINEAR)
    pix = small.resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(radius * 0.6))
    # мек ръб, но не по-широк от най-малката област (иначе тесните области „изчезват“)
    soft = mask.filter(ImageFilter.GaussianBlur(float(max(2.0, min(radius * 0.3, float(minh) * 0.15)))))
    out.paste(pix, (0, 0), soft)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--strength', type=float, default=1.0)
    ap.add_argument('--thr', type=float, default=0.42)
    ap.add_argument('--preview', action='store_true')
    a = ap.parse_args()
    src, dst = Path(a.src), Path(a.dst)
    dst.mkdir(parents=True, exist_ok=True)
    manual = {}
    if (src / 'manual.json').exists():
        manual = json.loads((src / 'manual.json').read_text())
    report = []
    for f in sorted(p for p in src.iterdir() if p.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp', '.heic')):
        im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
        m = manual.get(f.name, {})
        boxes = [] if m.get('skip') else detect(im, a.thr)
        # „keep“: области, които НЕ се замъгляват (напр. моето лице)
        for kx, ky, kw, kh in m.get('keep', []):
            boxes = [b for b in boxes if not (kx <= (b[0] + b[2]) / 2 <= kx + kw and ky <= (b[1] + b[3]) / 2 <= ky + kh)]
        boxes += [(x, y, x + w, y + h, 1.0) for x, y, w, h in m.get('add', [])]
        out = blur(im, boxes, a.strength)
        stem = f.stem
        out.save(dst / f'{stem}.jpg', quality=90)  # без EXIF/GPS
        web = out.copy()
        web.thumbnail((1600, 1600))
        web.save(dst / f'{stem}.webp', quality=80)
        if a.preview:
            pv = im.copy()
            pv.thumbnail((1400, 1400))
            k = pv.width / im.width
            dr = ImageDraw.Draw(pv)
            for x0, y0, x1, y1, sc in boxes:
                dr.rectangle([x0 * k, y0 * k, x1 * k, y1 * k], outline=(255, 60, 60), width=3)
            (dst / '_proverka').mkdir(exist_ok=True)
            pv.save(dst / '_proverka' / f'{stem}.jpg', quality=80)
        report.append(f'{f.name}: {len(boxes)} лица')
        print(report[-1], flush=True)
    (dst / '_otchet.txt').write_text('\n'.join(report) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
