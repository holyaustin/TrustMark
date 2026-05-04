import axios from 'axios';

const NOKIA_API_KEY = process.env.NOKIA_API_KEY!;
const NOKIA_BASE_URL = process.env.NOKIA_API_BASE_URL!;

const nokiaClient = axios.create({
  baseURL: NOKIA_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NOKIA_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export interface NumberVerificationResponse {
  verified: boolean;
  subscriberId?: string;
  message?: string;
}

export interface SimSwapResponse {
  swappedRecently: boolean;
  lastSwapDate?: string;
  daysSinceSwap?: number;
}

export interface LocationVerificationResponse {
  matched: boolean;
  confidence: number; // 0-100
  radius?: number; // meters
  addressSuggestion?: string;
}

export async function verifyNumber(phoneNumber: string): Promise<NumberVerificationResponse> {
  try {
    const response = await nokiaClient.post('/number-verification', { phoneNumber });
    return { verified: true, subscriberId: response.data.subscriberId };
  } catch (error: any) {
    console.error('Number verification failed:', error.response?.data || error.message);
    return { verified: false, message: error.response?.data?.message || 'Verification failed' };
  }
}

export async function checkSimSwap(phoneNumber: string): Promise<SimSwapResponse> {
  try {
    const response = await nokiaClient.post('/sim-swap', { phoneNumber });
    return {
      swappedRecently: response.data.swappedRecently || false,
      lastSwapDate: response.data.lastSwapDate,
      daysSinceSwap: response.data.daysSinceSwap
    };
  } catch (error: any) {
    console.error('SIM swap check failed:', error.response?.data || error.message);
    return { swappedRecently: false };
  }
}

export async function verifyLocation(phoneNumber: string, expectedAddress: string): Promise<LocationVerificationResponse> {
  try {
    const response = await nokiaClient.post('/location-verification', {
      phoneNumber,
      expectedAddress
    });
    return {
      matched: response.data.matched || false,
      confidence: response.data.confidence || 0,
      radius: response.data.radius,
      addressSuggestion: response.data.suggestedAddress
    };
  } catch (error: any) {
    console.error('Location verification failed:', error.response?.data || error.message);
    return { matched: false, confidence: 0 };
  }
}