// lib/oauth/oauth-helper.ts - Full implementation, no fallbacks
import axios from 'axios';
import crypto from 'crypto';

const RAPIDAPI_KEY = process.env.NOKIA_API_KEY!;
const RAPIDAPI_HOST = 'network-as-code.nokia.rapidapi.com';
const BASE_URL = 'https://network-as-code.p-eu.rapidapi.com';

// Store pending authorization requests
const pendingAuthRequests = new Map();

/**
 * Step 1: Get client credentials (client_id and client_secret)
 */
export async function getClientCredentials(): Promise<{ client_id: string; client_secret: string }> {
  try {
    const response = await axios.get(
      `${BASE_URL}/oauth2/v1/auth/clientcredentials`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      }
    );
    console.log('Client credentials obtained successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get client credentials:', error.response?.data || error.message);
    throw new Error('Could not obtain client credentials from Nokia');
  }
}

/**
 * Step 2: Get Fast Authorization Flow endpoint
 */
export async function getFastFlowEndpoint(): Promise<string> {
  try {
    const response = await axios.get(
      `${BASE_URL}/.well-known/openid-configuration`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      }
    );
    
    if (!response.data.fast_flow_csp_auth_endpoint) {
      throw new Error('fast_flow_csp_auth_endpoint not found in response');
    }
    
    console.log('Fast flow endpoint obtained:', response.data.fast_flow_csp_auth_endpoint);
    return response.data.fast_flow_csp_auth_endpoint;
  } catch (error: any) {
    console.error('Failed to get fast flow endpoint:', error.response?.data || error.message);
    throw new Error('Could not obtain fast flow endpoint from Nokia');
  }
}

/**
 * Step 3: Generate authorization URL for user consent
 */
export async function generateAuthUrl(
  phoneNumber: string,
  redirectUri: string
): Promise<{ url: string; state: string; nonce: string }> {
  const clientCredentials = await getClientCredentials();
  const fastFlowEndpoint = await getFastFlowEndpoint();
  
  // Generate random state and nonce for security
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');
  
  // Store for validation (expires in 10 minutes)
  pendingAuthRequests.set(state, {
    phoneNumber,
    redirectUri,
    nonce,
    createdAt: Date.now()
  });
  
  // Clean up old entries after 10 minutes
  setTimeout(() => pendingAuthRequests.delete(state), 10 * 60 * 1000);
  
  // Build authorization URL according to Nokia documentation
  const params = new URLSearchParams({
    scope: 'dpv:FraudPreventionAndDetection number-verification:verify',
    state: state,
    response_type: 'code',
    client_id: clientCredentials.client_id,
    redirect_uri: redirectUri,
    login_hint: phoneNumber,
    nonce: nonce
  });
  
  const url = `${fastFlowEndpoint}?${params.toString()}`;
  
  console.log('Generated auth URL:', url);
  console.log('State:', state);
  console.log('Nonce:', nonce);
  
  return { url, state, nonce };
}

/**
 * Step 4: Verify number using authorization code (Fast Flow)
 * According to docs: Pass code and state as query parameters
 */
export async function verifyNumberWithCode(
  phoneNumber: string,
  code: string,
  state: string
): Promise<boolean> {
  // Validate state matches pending request
  const pending = pendingAuthRequests.get(state);
  if (!pending) {
    console.error('Invalid or expired state parameter:', state);
    throw new Error('Invalid or expired authorization state');
  }
  
  // Verify phone number matches
  if (pending.phoneNumber !== phoneNumber) {
    console.error('Phone number mismatch. Expected:', pending.phoneNumber, 'Got:', phoneNumber);
    throw new Error('Phone number mismatch');
  }
  
  // Verify nonce (optional but recommended)
  // The nonce validation is done by the server; we just check it exists
  if (!pending.nonce) {
    console.error('Nonce missing from pending request');
    throw new Error('Invalid request state');
  }
  
  try {
    // Fast Flow: Pass code and state as query parameters as per documentation
    console.log('Making verification request with code:', code, 'state:', state);
    
    const response = await axios.post(
      `${BASE_URL}/passthrough/camara/v1/number-verification/number-verification/v0/verify?code=${code}&state=${state}`,
      { phoneNumber },
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const isVerified = response.data.devicePhoneNumberVerified === true;
    console.log('Number verification API response:', response.data);
    console.log('Number verification result:', isVerified);
    
    // Clean up pending state
    pendingAuthRequests.delete(state);
    
    return isVerified;
  } catch (error: any) {
    console.error('Number verification API error:', error.response?.data || error.message);
    
    // Clean up pending state on error
    pendingAuthRequests.delete(state);
    
    // Throw the error to be handled by the caller
    throw new Error(error.response?.data?.detail || 'Number verification failed');
  }
}

/**
 * Get device phone number using authorization code (Fast Flow)
 */
export async function getDevicePhoneNumber(
  code: string,
  state: string
): Promise<string | null> {
  try {
    const response = await axios.get(
      `${BASE_URL}/passthrough/camara/v1/number-verification/number-verification/v0/device-phone-number?code=${code}&state=${state}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        }
      }
    );
    return response.data.phoneNumber;
  } catch (error: any) {
    console.error('Failed to get device phone number:', error.response?.data || error.message);
    return null;
  }
}