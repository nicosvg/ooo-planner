<script lang="ts">
	import { page } from '$app/stores';
	import { getWeek } from 'date-fns/getWeek';
	import { onMount } from 'svelte';
	import { getPairs } from '../pairs';

	const weekNumber = getWeek(new Date());
	let teamMembers: string[] = [];
	let pairs: number[][] = [];
	let newMember = '';

	onMount(() => {
		teamMembers = $page.url.searchParams.get('team')?.split(',').sort() || [];
		pairs = getPairs(teamMembers.length, weekNumber);
	});

	function addMember() {
		if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
			teamMembers = [...teamMembers, newMember.trim()].sort();
			const searchParams = new URLSearchParams($page.url.searchParams);
			searchParams.set('team', teamMembers.join(','));
			window.history.replaceState({}, '', `${$page.url.pathname}?${searchParams.toString()}`);
			newMember = '';
			pairs = getPairs(teamMembers.length, weekNumber);
		}
	}
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
			<div>
				<!-- Add a field and a button to add a new member to the query param 'team'  -->
				<input type="text" bind:value={newMember} placeholder="Add team member" />
				<button on:click={addMember}>Add</button>
			</div>
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

		@media screen and (max-width: 480px) {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr;
		}
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

	@media screen and (max-width: 480px) {
		.team-container {
			grid-column: 1 / span 1;
			grid-row: 3 / span 1;
		}
		.pairs-container {
			grid-column: 1 / span 2;
			grid-row: 2 / span 1;
		}
		.content {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr;
		}
	}
</style>
