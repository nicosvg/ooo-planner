<script lang="ts">
	import { page } from '$app/stores';
	import { getWeek } from 'date-fns/getWeek';
	import { onMount } from 'svelte';
	import { getPairs } from '../pairs';

	let weekNumber = getWeek(new Date());

	let teamMembers: string[] = [];
	let pairs: number[][] = [];
	let newMember = '';
	let offset = 0;

	function updatePairs() {
		pairs = getPairs(teamMembers.length, weekNumber + offset);
	}

	function incrementWeek() {
		weekNumber += 1;
		if (weekNumber > 52) {
			weekNumber = 1;
		}
		updatePairs();
	}

	function decrementWeek() {
		weekNumber -= 1;
		if (weekNumber < 1) {
			weekNumber = 52;
		}
		updatePairs();
	}

	onMount(() => {
		teamMembers = $page.url.searchParams.get('team')?.split(',').sort() || [];
		const offsetParam = $page.url.searchParams.get('offset') || '0';
		offset = parseInt(offsetParam);
		updatePairs();
	});

	function addMember() {
		if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
			teamMembers = [...teamMembers, newMember.trim()].sort();
			const searchParams = new URLSearchParams($page.url.searchParams);
			searchParams.set('team', teamMembers.join(','));
			window.history.replaceState({}, '', `${$page.url.pathname}?${searchParams.toString()}`);
			newMember = '';
			pairs = getPairs(teamMembers.length, weekNumber + offset);
		}
	}

	function handleEnterKey(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addMember();
		}
	}

	function removeMember(member: string) {
		teamMembers = teamMembers.filter((m) => m !== member);
		const searchParams = new URLSearchParams($page.url.searchParams);
		searchParams.set('team', teamMembers.join(','));
		window.history.replaceState({}, '', `${$page.url.pathname}?${searchParams.toString()}`);
		updatePairs();
	}

	function copyUrlToClipboard() {
		const url = window.location.href;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				alert('URL copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy URL: ', err);
			});
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
				<button class="week-button" on:click={decrementWeek}>◁</button>
				Week {weekNumber + offset}
				<button class="week-button" on:click={incrementWeek}>▷</button>
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
					<span>{member}</span>
					<button class="remove-button" on:click={() => removeMember(member)}>-</button>
				</div>
			{/each}
			<div>
				<input
					type="text"
					bind:value={newMember}
					placeholder="Add team member"
					on:keydown={handleEnterKey}
				/>
				<button on:click={addMember}>Add</button>
			</div>
		</div>
	</div>
	<div class="copy-url-container">
		<button on:click={copyUrlToClipboard}>Copy URL</button>
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
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.week-button {
		background-color: transparent;
		border: none;
		color: var(--color-theme-2);
		font-size: 1.5rem;
		cursor: pointer;
	}
	.copy-url-container {
		grid-column: 1 / span 2;
		grid-row: 3 / span 1;
		margin-top: 1rem;
		text-align: center;
	}

	.copy-url-container button {
		background-color: var(--color-theme-2);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 0.25rem;
	}

	.copy-url-container button:hover {
		background-color: var(--color-theme-1);
	}

	.remove-button {
		background-color: transparent;
		border: none;
		color: var(--color-theme-2);
		font-size: 1.5rem;
		cursor: pointer;
	}
</style>
