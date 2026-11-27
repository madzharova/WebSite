<script>
	import { base } from '$app/paths';
	import { documents, documentGroups, totalCredits } from '$lib/data/documents.js';
	import { byId } from '$lib/data/criteria.js';
	import { criterionHref } from '$lib/content.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<svelte:head><title>Опис на документите · Портфолио</title></svelte:head>
<PageHeader back={{ href: `${base}/portfolio/`, label: 'Портфолио' }}
	eyebrow="чл. 67, т. 4"
	title="Опис на документите"
	lead="Документи за образование, квалификация и професионален стаж."
/>

<section class="section">
	<div class="wrap">
		<dl class="sum">
			<div><dt>Квалификационни кредити (2021–2025)</dt><dd>{totalCredits}</dd></div>
			<div><dt>Обучения с кредити</dt><dd>{documents.filter((d) => d.credits).length}</dd></div>
			<div><dt>ПКС</dt><dd>IV</dd></div>
		</dl>
		{#each documentGroups as g}
			{@const list = documents.filter((d) => d.group === g)}
			{#if list.length}
				<h2 class="gh">{g}</h2>
				<table>
					<colgroup><col style="width: 56%" /><col style="width: 17%" /><col style="width: 15%" /><col style="width: 12%" /></colgroup>
					<thead><tr><th>Документ</th><th>Дата / период</th><th>Часове · кредити</th><th>Критерии</th></tr></thead>
					<tbody>
						{#each list as d}
							<tr>
								<td>{d.title}{#if d.issuer}<small class:fill={d.issuer.includes('[')}>{d.issuer}</small>{/if}{#if d.note}<small class:fill={d.note.includes('[')}>{d.note}</small>{/if}</td>
								<td class="nowrap"><span class:fill={String(d.date).includes('[')}>{d.date}</span></td>
								<td class="nowrap">
									{#if d.hours}<span class:fill={String(d.hours).includes('[')}>{d.hours}{typeof d.hours === 'number' ? ' ч.' : ''}</span>{/if}
									{#if d.credits} · {d.credits} кр.{/if}
								</td>
								<td class="cr">
									{#each d.criteria ?? [] as id}
										{@const c = byId[id]}
										{#if c}<a href={criterionHref(c)}>{c.section}.{c.num}</a>{/if}
									{/each}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{/each}
	</div>
</section>

<style>
	.sum {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin: 0 0 56px;
	}
	.sum div {
		padding: 18px 24px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		min-width: 180px;
	}
	.sum dt {
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.sum dd {
		margin: 4px 0 0;
		font-family: var(--serif);
		font-size: 44px;
		line-height: 1;
		color: var(--sea);
	}
	.nowrap {
		white-space: nowrap;
	}
	.gh {
		font-size: 28px;
		margin: 48px 0 16px;
	}
	.gh:first-child {
		margin-top: 0;
	}
	table {
		table-layout: fixed;
		width: 100%;
		border-collapse: collapse;
		font-size: 15px;
	}
	th {
		text-align: left;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--ink-soft);
		padding: 10px 12px 10px 0;
		border-bottom: 1px solid var(--line-strong);
	}
	td {
		padding: 14px 12px 14px 0;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}
	td small {
		display: block;
		width: fit-content;
		font-size: 13px;
		color: var(--ink-soft);
		margin-top: 2px;
	}
	.cr a {
		margin-right: 8px;
		font-family: var(--serif);
		font-size: 17px;
		text-decoration: none;
	}
	@media (max-width: 700px) {
		thead {
			display: none;
		}
		tr,
		td {
			display: block;
		}
		tr {
			padding: 12px 0;
			border-bottom: 1px solid var(--line);
		}
		td {
			border: 0;
			padding: 2px 0;
		}
	}
</style>
