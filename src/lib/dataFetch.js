const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = 'v3.football.api-sports.io';
const API_URL = 'https://v3.football.api-sports.io/players/topscorers';

/**
 * Fetches top scorers data from the API
 * @param {Object} params - Query parameters
 * @param {number} params.league - League ID (e.g., 39 for Premier League)
 * @param {number} params.season - Season year (e.g., 2024)
 * @returns {Promise<Array>} Array of top scorer data
 */
export async function fetchTopScorers(params = {}) {
  try {
    const { league = 39, season = 2025 } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      league,
      season
    });

    // Set up headers
    const headers = new Headers();
    headers.append('x-rapidapi-key', API_KEY);
    headers.append('x-rapidapi-host', API_HOST);

    // Make the request
    const response = await fetch(`${API_URL}?${queryParams}`, {
      method: 'GET',
      headers,
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('Fetched top scorers:', data);

    return data.response || [];
  } catch (error) {
    console.error('Data recovery error:', error);
    throw error;
  }
}

export default fetchTopScorers;