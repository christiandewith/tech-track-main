<script>
  import Bar from '../components/Bar.svelte';
  import { getCleanedTopScorers } from '$lib/dataClean.js';
  import { onMount } from 'svelte';
  import '$lib/style.css';


  let scorers = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      scorers = await getCleanedTopScorers({
        league: 39,
        season: 2025
      });
      console.log('Cleaned top scorers loaded:', scorers);
    } catch (err) {
      error = err.message;
      console.error('Error loading top scorers:', err);
    } finally {
      loading = false;
    }
  });
</script>

<main>
  {#if loading}
    <p>Loading top scorers...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <p>Loaded {scorers.length} top scorers</p>
    {#each scorers as player (player.lastname)}
      <div class="player-card">
        {#if player.photo}
          <img src={player.photo} alt={player.lastname} class="player-photo" />
        {/if}
        <div class="player-info">
          <h3>{player.lastname}</h3>
          {#if player.logo}
            <img src={player.logo} alt={player.team} class="team-logo" />
          {/if}
          <p><strong>Team:</strong> {player.team}</p>
          <p><strong>Goals:</strong> {player.goals}</p>
          <p><strong>Assists:</strong> {player.assists}</p>
          <p><strong>Nationality:</strong> {player.nationality}</p>
        </div>
      </div>
    {/each}
  {/if}
  <Bar/>
</main>