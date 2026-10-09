/**
 * Send welcome message to user
 * Call the WhatsApp welcome API to send a welcome message to the user's phone number.
 * @param phone
 * @returns
 */
export const sendWelcomeMessage = async (phone: string) => {
  try {
    const response = await fetch('/api/whatsapp-welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_phone: phone }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send welcome message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending welcome message:', error);
    throw error;
  }
};
