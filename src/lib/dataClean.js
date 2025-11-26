import { fetchTopScorers } from './dataFetch.js';

// Flatten raw player entries into simple objects for UI usage.
export function cleanPlayerData(players) {
  if (!Array.isArray(players)) return [];

  // filter -> map: keep valid entries, then transform
  return players
    .filter((p) => (
      p &&
      p.player && p.player.lastname &&
      p.statistics && p.statistics[0] &&
      p.statistics[0].team && p.statistics[0].team.name
    ))
    .map((p) => ({
      lastname: p.player.lastname,
      team: p.statistics[0].team.name,
      goals: (p.statistics[0].goals && p.statistics[0].goals.total),
      assists: (p.statistics[0].goals && p.statistics[0].goals.assists),
      photo: p.player.photo,
      nationality: p.player.nationality,
      logo: p.statistics[0].team.logo
    }));
}

// Fetch raw top scorers and return cleaned player data.
export async function getCleanedTopScorers({ league = 39, season = 2025 } = {}) {
  try {
    const raw = await fetchTopScorers({ league, season });
    const cleaned = cleanPlayerData(raw);
    console.log('Cleaned players count:', cleaned.length);
    return cleaned;
  } catch (err) {
    console.error('getCleanedTopScorers error:', err);
    throw err;
  }
}
