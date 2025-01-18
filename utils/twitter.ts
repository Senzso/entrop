export async function checkTwitterUsername(username: string) {
  try {
    const response = await fetch(`/api/twitter-check?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking Twitter username:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred' };
  }
}

