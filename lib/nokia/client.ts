// lib/nokia/client.ts - Fixed version
import axios from 'axios';

const RAPIDAPI_KEY = process.env.NOKIA_API_KEY!;
const RAPIDAPI_HOST = 'network-as-code.nokia.rapidapi.com';
const BASE_URL = 'https://network-as-code.p-eu.rapidapi.com';

// Simulator test numbers from Nokia documentation
export const SIMULATOR_NUMBERS = {
  VERIFIED: '+99999991000',
  NOT_VERIFIED: '+99999991001',
  BAD_REQUEST: '+99999990400',
  NOT_FOUND: '+99999990404',
  UNPROCESSABLE: '+99999990422',
  SERVER_ERROR: '+99999990500',
} as const;

// IMPORTANT: Use axios with correct headers
const rapidApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Add request interceptor for debugging
rapidApiClient.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

rapidApiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
);

/**
 * Number Verification API
 * POST /passthrough/camara/v1/number-verification/number-verification/v0/verify
 * Response: { "devicePhoneNumberVerified": true }
 */
export async function verifyNumber(phoneNumber: string): Promise<{ verified: boolean; error?: string }> {
  try {
    const response = await rapidApiClient.post(
      '/passthrough/camara/v1/number-verification/number-verification/v0/verify',
      { phoneNumber }
    );
    return { verified: response.data.devicePhoneNumberVerified === true };
  } catch (error: any) {
    console.error('Number verification failed:', error.response?.data || error.message);
    const status = error.response?.status;
    if (status === 400) return { verified: false, error: 'Invalid phone number format' };
    if (status === 401) return { verified: false, error: 'Authentication failed. Check API key.' };
    if (status === 403) return { verified: false, error: 'Permission denied' };
    if (status === 404) return { verified: false, error: 'Phone number not found' };
    if (status === 500) return { verified: false, error: 'Server error, try again' };
    return { verified: false, error: error.response?.data?.detail || 'Verification failed' };
  }
}

/**
 * SIM Swap Check API
 * POST /passthrough/camara/v1/sim-swap/sim-swap/v0/check
 * Response: { "swapped": true/false }
 */
export async function checkSimSwap(phoneNumber: string, maxAge: number = 240): Promise<{
  swappedRecently: boolean;
  daysSinceSwap?: number;
  lastSwapDate?: string;
}> {
  try {
    const response = await rapidApiClient.post(
      '/passthrough/camara/v1/sim-swap/sim-swap/v0/check',
      { phoneNumber, maxAge }
    );
    return {
      swappedRecently: response.data.swapped === true,
      daysSinceSwap: undefined,
      lastSwapDate: undefined
    };
  } catch (error) {
    console.error('SIM swap check failed:', error);
    return { swappedRecently: false };
  }
}

/**
 * SIM Swap Date API
 * POST /passthrough/camara/v1/sim-swap/sim-swap/v0/retrieve-date
 * Response: { "latestSimChange": "2023-07-03T14:27:08.312+02:00" }
 */
export async function getSimSwapDate(phoneNumber: string): Promise<{ lastSwapDate?: string }> {
  try {
    const response = await rapidApiClient.post(
      '/passthrough/camara/v1/sim-swap/sim-swap/v0/retrieve-date',
      { phoneNumber }
    );
    return { lastSwapDate: response.data.latestSimChange };
  } catch (error) {
    console.error('SIM swap date retrieval failed:', error);
    return {};
  }
}

/**
 * KYC Tenure API
 * POST /passthrough/camara/v1/kyc-tenure/kyc-tenure/v0.1/check-tenure
 * Response: { "tenureDateCheck": true, "contractType": "PAYG" }
 */
export async function checkTenure(phoneNumber: string): Promise<{
  meetsTenure: boolean;
  contractType?: string;
  tenureYears?: number;
}> {
  const tenureDate = new Date();
  tenureDate.setFullYear(tenureDate.getFullYear() - 1);
  
  try {
    const response = await rapidApiClient.post(
      '/passthrough/camara/v1/kyc-tenure/kyc-tenure/v0.1/check-tenure',
      { 
        phoneNumber, 
        tenureDate: tenureDate.toISOString().split('T')[0] 
      }
    );
    return {
      meetsTenure: response.data.tenureDateCheck === true,
      contractType: response.data.contractType,
      tenureYears: response.data.tenureDateCheck ? 1 : 0
    };
  } catch (error) {
    console.error('Tenure check failed:', error);
    return { meetsTenure: false };
  }
}

/**
 * KYC Fill-in API
 * POST /passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in
 * Response: { "name": "Federica Sanchez Arjona", ... }
 */
export async function getKycData(phoneNumber: string): Promise<{
  fullName?: string;
  givenName?: string;
  familyName?: string;
  address?: string;
  birthdate?: string;
  nationality?: string;
}> {
  try {
    const response = await rapidApiClient.post(
      '/passthrough/camara/v1/kyc-fill-in/kyc-fill-in/v0.4/fill-in',
      { phoneNumber }
    );
    return {
      fullName: response.data.name,
      givenName: response.data.givenName,
      familyName: response.data.familyName,
      address: response.data.address,
      birthdate: response.data.birthdate,
      nationality: response.data.nationality
    };
  } catch (error) {
    console.error('KYC fill-in failed:', error);
    return {};
  }
}

/**
 * KYC Match API
 * POST /passthrough/camara/v1/kyc-match/kyc-match/v0.3/match
 * Response: { "nameMatch": "true", "addressMatch": "true", ... }
 */
export async function verifyKycMatch(
  phoneNumber: string,
  fullName: string,
  address: string
): Promise<{
  nameMatch: boolean;
  addressMatch: boolean;
  overallMatch: boolean;
}> {
  try {
    const response = await rapidApiClient.post(
      '/passthrough/camara/v1/kyc-match/kyc-match/v0.3/match',
      { 
        phoneNumber, 
        name: fullName,
        address: address
      }
    );
    return {
      nameMatch: response.data.nameMatch === 'true',
      addressMatch: response.data.addressMatch === 'true',
      overallMatch: response.data.nameMatch === 'true' && response.data.addressMatch === 'true'
    };
  } catch (error) {
    console.error('KYC match failed:', error);
    return { nameMatch: false, addressMatch: false, overallMatch: false };
  }
}

  /**
   * Location Verification API
   * POST /location-verification/v0/verify
   * Response: { "verificationResult": "TRUE", "lastLocationTime": "..." }
   * 
   * Simulator mapping (SWAPPED for our test number +99999991000):
   * - +99999991000 -> TRUE (Device IS in the given area)
   * - +99999991001 -> FALSE (Device is NOT in the given area)
   * - +99999991002 -> PARTIAL (Device partially within area)
   * - +99999991003 -> UNKNOWN (Device location unknown)
   */
  export async function verifyDeviceLocation(
    phoneNumber: string,
    latitude: number,
    longitude: number,
    radius: number = 5000
  ): Promise<{
    verified: boolean;
    lastLocationTime?: string;
    matchRate?: number;
    resultType?: string;
  }> {
    try {
      const response = await rapidApiClient.post(
        '/location-verification/v0/verify',
        {
          device: { phoneNumber },
          area: {
            areaType: 'CIRCLE',
            center: { latitude, longitude },
            radius: radius
          }
        }
      );
      
      const resultType = response.data.verificationResult;
      // SWAPPED: For our test number +99999991000, we want TRUE
      // The simulator returns TRUE for +99999991000 and FALSE for +99999991001
      // So no change needed - just use the API response directly
      return {
        verified: resultType === 'TRUE' || resultType === 'PARTIAL',
        lastLocationTime: response.data.lastLocationTime,
        matchRate: resultType === 'TRUE' ? 95 : resultType === 'PARTIAL' ? 60 : 0,
        resultType: resultType
      };
    } catch (error) {
      console.error('Location verification API error:', error);
      return { verified: false };
    }
  }


/**
 * Number Verification using OAuth code (Fast Flow)
 * This should be used instead of verifyNumber when you have an OAuth code
 */
export async function verifyNumberWithOAuthCode(
  phoneNumber: string,
  code: string,
  state: string
): Promise<{ verified: boolean; error?: string }> {
  try {
    const response = await rapidApiClient.post(
      `/passthrough/camara/v1/number-verification/number-verification/v0/verify?code=${code}&state=${state}`,
      { phoneNumber }
    );
    return { verified: response.data.devicePhoneNumberVerified === true };
  } catch (error: any) {
    console.error('Number verification with OAuth code failed:', error.response?.data || error.message);
    return { verified: false, error: error.response?.data?.detail || 'Verification failed' };
  }
}


/**
 * Device Status API
 * POST /device-status/v0/connectivity
 * Response: { "connectivityStatus": "CONNECTED_DATA" }
 */
export async function getDeviceStatus(phoneNumber: string): Promise<{
  connectivityStatus: 'CONNECTED_DATA' | 'CONNECTED_SMS' | 'NOT_CONNECTED';
}> {
  try {
    const response = await rapidApiClient.post(
      '/device-status/v0/connectivity',
      { device: { phoneNumber } }
    );
    return { connectivityStatus: response.data.connectivityStatus };
  } catch (error) {
    console.error('Device status check failed:', error);
    return { connectivityStatus: 'NOT_CONNECTED' };
  }
}