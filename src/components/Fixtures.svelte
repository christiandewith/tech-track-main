<script>
  import { getFixtures } from '$lib/dataFetch.js';
  import { onMount } from 'svelte';

  // Component state: list of fixtures, loading flag, and error message.
  let fixtures = [];
  let loading = true;
  let error = null;

  // Lifecycle: fetch the latest fixtures once after the component mounts.
  onMount(async () => {
    try {
      // API call for recent fixtures (Premier League = league 39).
      fixtures = await getFixtures({ league: 39, season: 2025, last: 10 });
      console.log('Fixtures:', fixtures);
    } catch (error) {
      // Capture and display any fetch error.
      error = error.message;
      console.error('Error loading fixtures:', error);
    } finally {
      // Ensure loading spinner stops regardless of success/failure.
      loading = false;
    }
  });
</script>

<div class="fixtures-container">
  <h2>Latest Fixtures</h2>
  {#if loading}
    <p>Loading fixtures...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if fixtures.length > 0}
    <div class="fixtures-list">
      {#each fixtures as f}
        <div class="fixture-card">
          <div class="team team--home">
            <img src={f.teams.home.logo} alt={f.teams.home.name} class="team-logo-small" />
            <div class="team-name">{f.teams.home.name}</div>
          </div>

          <div class="fixture-score">{f.goals.home} <span class="dash">-</span> {f.goals.away}</div>

          <div class="team team--away">
            <img src={f.teams.away.logo} alt={f.teams.away.name} class="team-logo-small" />
            <div class="team-name">{f.teams.away.name}</div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No fixtures available</p>
  {/if}
</div>
