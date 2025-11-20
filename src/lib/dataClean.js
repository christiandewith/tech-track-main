import { fetchTopScorers } from './dataFetch.js';

/**
 * Cleans and filters player data
 * Extracts: lastname, team, goals, photo, nationality, assists, logo
 * @param {Array} playersData - Raw player data from API
 * @returns {Array} Cleaned player data
 */
export function cleanPlayerData(playersData) {
  return playersData.map(player => ({
    lastname: player.player?.lastname || 'N/A',
    team: player.statistics?.[0]?.team?.name || 'N/A',
    goals: player.statistics?.[0]?.goals?.total || 0,
    assists: player.statistics?.[0]?.goals?.assists || 0,
    photo: player.player?.photo || '',
    nationality: player.player?.nationality || 'N/A',
    logo: player.statistics?.[0]?.team?.logo || ''
  }));
}

/**
 * Fetches and cleans top scorers data
 * @param {Object} params - Query parameters (league, season)
 * @returns {Promise<Array>} Cleaned player data
 */
export async function getCleanedTopScorers(params = {}) {
  try {
    const rawData = await fetchTopScorers(params);
    const cleanedData = cleanPlayerData(rawData);
    console.log('Cleaned player data:', cleanedData);
    return cleanedData;
  } catch (error) {
    console.error('Error cleaning data:', error);
    throw error;
  }
}

export default getCleanedTopScorers;
