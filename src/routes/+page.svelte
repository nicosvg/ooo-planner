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
		<p class="week-number">
			Week {weekNumber}
		</p>
		<div class="pairs-container">
			{#if pairs.length > 0}
				<h2 class="pairs-title">This week's pairs:</h2>
				<ul class="pairs-list">
					{#each pairs as pair}
						<li class="pair-item">
							{teamMembers[pair[0]]} & {teamMembers[pair[1]]}
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
		max-width: 100%;
		min-height: 100vh;
		background-color: #fef3c7;
		color: #1f2937;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.content {
		padding: 1rem;
		max-width: 48rem;
		background-color: #ffedd5;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.logo {
		width: 32rem;
		max-width: 100%;
	}

	.week-number {
		padding-top: 4rem;
		font-size: 1.25rem;
		font-weight: bold;
	}

	.pairs-container {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pairs-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.pairs-list {
		list-style-type: disc;
		padding-left: 1.5rem;
	}

	.pair-item {
		margin-bottom: 0.5rem;
	}

	.team-container {
		padding-top: 4rem;
	}

	.team-title {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.team-member {
		margin-bottom: 0.5rem;
	}
</style>
