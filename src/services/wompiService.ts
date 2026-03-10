import axios from 'axios';

const getWompiPublicKey = (): string => {
  const key = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
  if (!key) {
    throw new Error('Missing VITE_WOMPI_PUBLIC_KEY environment variable');
  }
  return key;
};

const wompiApi = axios.create({
  baseURL: import.meta.env.VITE_WOMPI_API_URL || 'https://api-sandbox.co.uat.wompi.dev/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getWompiPublicKey()}`,
  },
});

export const wompiService = {
  async tokenizeCard(cardData: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    try {
      const response = await wompiApi.post('/tokens/cards', {
        number: cardData.number.replace(/\s/g, ''),
        cvc: cardData.cvc,
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        card_holder: cardData.card_holder,
      });
      
      return response.data.data.id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      console.error('Wompi tokenization error:', err.response?.data);
      throw new Error(err.response?.data?.error?.message || 'Failed to tokenize card');
    }
  },

  async getAcceptanceToken(): Promise<string> {
    try {
      const publicKey = getWompiPublicKey();
      const response = await wompiApi.get(`/merchants/${publicKey}`);
      
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      console.error('Wompi acceptance token error:', error);
      throw new Error('Failed to get acceptance token');
    }
  },

  async getTransactionStatus(transactionId: string) {
    try {
      const response = await wompiApi.get(`/transactions/${transactionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Wompi transaction status error:', error);
      throw error;
    }
  },
};
