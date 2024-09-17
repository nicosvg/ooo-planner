<script lang="ts">
	import { getWeek } from 'date-fns/getWeek';
	import { getPairs } from '../pairs';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	const weekNumber = getWeek(new Date());
	let teamMembers: string[] = [];
	let pairs: number[][] = [];

	onMount(() => {
		teamMembers = $page.url.searchParams.get('team')?.split(',').sort() || [];
		pairs = getPairs(teamMembers.length, weekNumber);
	});
</script>

<svelte:head>
	<title>1:1 planner</title>
	<meta name="description" content="1:1 meetings" />
</svelte:head>

<div class="container">
	<div class="content">
		<img src="/logo.png" class="logo" alt="logo" />
		<div class="pairs-container">
			<p class="week-number">
				Week {weekNumber}
			</p>
			{#if pairs.length > 0}
				<ul class="pairs-list">
					{#each pairs as pair}
						<li class="pair-item">
							{#if pair[0] === pair[1]}
								{teamMembers[pair[0]]}
							{:else}
								{teamMembers[pair[0]]} <span class="separator">↔</span> {teamMembers[pair[1]]}
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p>No pairs available for this week.</p>
			{/if}
		</div>
		<div class="team-container">
			<h2 class="team-title">Team</h2>
			{#each teamMembers as member}
				<div class="team-member">
					{member}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.logo {
		width: 32rem;
	}

	.container {
		max-width: 100vw;
		min-height: 100vh;
		background-color: --var(color-bg-0);
		color: --var(color-text-0);
	}

	.content {
		width: 100%;
		background-color: --var(color-bg-0);
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		justify-items: center;
		align-items: center;
	}

	.logo {
		width: 32rem;
		max-width: 100%;
		grid-column: 1 / span 3;
		grid-row: 1 / span 1;
	}

	.week-number {
		font-size: 2rem;
		font-weight: bold;
	}

	.pairs-container {
		grid-column: 2 / span 1;
		grid-row: 2 / span 2;
	}

	.pairs-list {
		list-style-type: none;
		padding-left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pair-item {
		margin-bottom: 0.5rem;
	}

	.team-container {
		grid-column: 1 / span 1;
		grid-row: 2 / span 2;
	}

	.team-title {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.team-member {
		margin-bottom: 0.5rem;
	}

	.separator {
		color: var(--color-theme-2);
	}
</style>
