<script>
  // Imports: chart component, fixtures list, data cleaning helper, lifecycle, global styles.
  import Bar from '../components/Bar.svelte';
  import Fixtures from '../components/Fixtures.svelte';
  import { getCleanedTopScorers } from '$lib/dataClean.js';
  import { onMount } from 'svelte';
  import '$lib/style.css';

  // State: top scorers array plus loading/error flags for fetch lifecycle.
  let scorers = [];
  let loading = true;
  let error = null;

  // Load cleaned top scorers once when the page mounts.
  onMount(async () => {
    try {
      scorers = await getCleanedTopScorers({ league: 39, season: 2025 });
      console.log('Cleaned top scorers loaded:', scorers);
    } catch (err) {
      error = err.message;
      console.error('Error loading top scorers:', err);
    } finally {
      loading = false; // Stop showing loading state regardless of success/failure.
    }
  });
</script>

<main>
  {#if loading}
    <p>Loading top scorers...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <!-- Chart section: scatter plot of goals vs assists -->
    <div class="chart-container-top">
      <h2>Goals vs Assists</h2>
      <p>Bubblechart of the players with most goals and assists in the current Premier League season. Here we see that Erling Haaland is in a league of his own when it comes to goal scoring this season. </p>
      <Bar />
    </div>

    <!-- Bottom layout: left = top scorers list; right = recent fixtures -->
    <div class="container-bottom">
      <div class="scorers-container">
        <h2>Top Scorers</h2>
        <div class="players-list">
          {#each scorers as player (player.lastname)}
            <div class="player-card compact">
              {#if player.photo}
                <img src={player.photo} alt={player.lastname} class="player-photo" />
              {/if}

              <div class="player-info compact-info">
                <div class="player-top">
                  <h3 class="player-name">{player.lastname}</h3>
                  {#if player.logo}
                    <img src={player.logo} alt={player.team} class="team-logo small" />
                  {/if}
                </div>
                <div class="player-goals"> GOALS: {player.goals}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Fixtures component shows latest matches -->
      <Fixtures />
    </div>
  {/if}
</main>
