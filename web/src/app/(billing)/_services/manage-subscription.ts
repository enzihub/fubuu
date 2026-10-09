export async function redirectToStripeCustomerPortal() {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { url } = await response.json();

    // Redirect to the portal URL
    if (url) {
      return (window.location.href = url);
    }
  } catch (error) {
    console.error('Error redirecting to customer portal:', error);
    throw error;
  }
}
