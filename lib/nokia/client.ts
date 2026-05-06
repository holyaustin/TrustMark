// lib/nokia/client.ts
import axios from 'axios';

const NOKIA_API_KEY = process.env.NOKIA_API_KEY!;
const NOKIA_BASE_URL = process.env.NOKIA_API_BASE_URL!;
const USE_SIMULATOR = process.env.USE_SIMULATOR === 'true';

// Simulated responses for hackathon demo
const SIMULATED_RESPONSES = {
  numberVerification: { verified: true, subscriberId: 'SIM_MTN_NG_12345678' },
  simSwap: { swappedRecently: false, daysSinceSwap: 365, lastSwapDate: '2023-01-15' },
  kycTenure: { meetsTenure: true, contractType: 'PAYM', tenureYears: 3 },
  kycFillIn: {
    fullName: 'Adebayo Ogunlesi',
    givenName: 'Adebayo',
    familyName: 'Ogunlesi',
    address: '15 Allen Avenue, Ikeja, Lagos',
    birthdate: '1985-06-15',
    nationality: 'NG'
  },
  kycMatch: { nameMatch: true, addressMatch: true, overallMatch: true },
  locationVerification: { matched: true, stateMatch: 'Lagos', confidence: 92 }
};

const nokiaClient = axios.create({
  baseURL: NOKIA_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NOKIA_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Helper to use simulator or real API
async function callApi<T>(endpoint: string, data: any, simulateData: T): Promise<T> {
  if (USE_SIMULATOR) {
    console.log(`[SIMULATOR] Calling ${endpoint} - returning mock data`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return simulateData;
  }
  
  try {
    const response = await nokiaClient.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    console.error(`API Error ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`Nokia API failed: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Number Verification - Silent authentication
 * Confirms phone number belongs to device owner
 */
export async function verifyNumber(phoneNumber: string) {
  return callApi(
    '/number-verification',
    { phoneNumber },
    { ...SIMULATED_RESPONSES.numberVerification, phoneNumber }
  );
}

/**
 * SIM Swap Detection - Checks if SIM was recently changed
 */
export async function checkSimSwap(phoneNumber: string) {
  return callApi(
    '/sim-swap',
    { phoneNumber },
    SIMULATED_RESPONSES.simSwap
  );
}

/**
 * KYC Tenure - Verifies continuous customer status
 */
export async function checkTenure(phoneNumber: string) {
  return callApi(
    '/kyc-tenure',
    { phoneNumber },
    SIMULATED_RESPONSES.kycTenure
  );
}

/**
 * KYC Fill-in - Retrieves customer data from operator records
 * Auto-populates registration form
 */
export async function getKycData(phoneNumber: string) {
  return callApi(
    '/kyc-fill-in',
    { phoneNumber },
    SIMULATED_RESPONSES.kycFillIn
  );
}

/**
 * KYC Match - Validates user-provided data against operator records
 * Core identity verification
 */
export async function verifyKycMatch(phoneNumber: string, fullName: string, address: string) {
  return callApi(
    '/kyc-match',
    { phoneNumber, name: fullName, address },
    { ...SIMULATED_RESPONSES.kycMatch, phoneNumber }
  );
}

/**
 * Location Verification - Dynamic (checks within same state)
 * Not exact location - just confirms seller is in same state as business
 */
export async function verifyLocation(phoneNumber: string, latitude: number, longitude: number, expectedState: string) {
  // In simulator mode, just return success
  if (USE_SIMULATOR) {
    return { matched: true, stateMatch: expectedState, confidence: 95 };
  }
  
  // Real implementation would use geocoding to convert lat/lng to state/region
  // Then compare with expectedState
  const response = await nokiaClient.post('/location-verification', {
    phoneNumber,
    latitude,
    longitude,
    expectedState
  });
  
  return {
    matched: response.data.stateMatch,
    stateMatch: response.data.matchedState,
    confidence: response.data.confidence
  };
}