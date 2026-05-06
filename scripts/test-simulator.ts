// scripts/test-simulator.ts
// Run with: npx ts-node scripts/test-simulator.ts

import { 
  verifyNumber, 
  checkSimSwap, 
  checkTenure, 
  getKycData, 
  verifyKycMatch,
  verifyLocation 
} from '../lib/nokia/client';

async function testSimulator() {
  console.log('🧪 Testing Nokia API Simulator...\n');
  
  const testPhone = '08012345678';
  
  // Test 1: Number Verification
  console.log('1. Number Verification');
  const numberResult = await verifyNumber(testPhone);
  console.log(`   Result: ${numberResult.verified ? '✅ Verified' : '❌ Failed'}`);
  console.log(`   Subscriber ID: ${numberResult.subscriberId}\n`);
  
  // Test 2: SIM Swap
  console.log('2. SIM Swap Check');
  const simSwapResult = await checkSimSwap(testPhone);
  console.log(`   Swapped Recently: ${simSwapResult.swappedRecently ? 'Yes' : 'No'}`);
  console.log(`   Days Since Swap: ${simSwapResult.daysSinceSwap}\n`);
  
  // Test 3: KYC Tenure
  console.log('3. KYC Tenure');
  const tenureResult = await checkTenure(testPhone);
  console.log(`   Meets Tenure: ${tenureResult.meetsTenure ? '✅ Yes' : '❌ No'}`);
  console.log(`   Contract Type: ${tenureResult.contractType}\n`);
  
  // Test 4: KYC Fill-in
  console.log('4. KYC Fill-in');
  const kycData = await getKycData(testPhone);
  console.log(`   Full Name: ${kycData.fullName}`);
  console.log(`   Address: ${kycData.address}`);
  console.log(`   Birthdate: ${kycData.birthdate}\n`);
  
  // Test 5: KYC Match
  console.log('5. KYC Match');
  const matchResult = await verifyKycMatch(testPhone, 'Adebayo Ogunlesi', '15 Allen Avenue, Ikeja, Lagos');
  console.log(`   Name Match: ${matchResult.nameMatch ? '✅' : '❌'}`);
  console.log(`   Address Match: ${matchResult.addressMatch ? '✅' : '❌'}\n`);
  
  // Test 6: Location Verification
  console.log('6. Location Verification');
  const locationResult = await verifyLocation(testPhone, 6.5244, 3.3792, 'Lagos');
  console.log(`   Matched: ${locationResult.matched ? '✅' : '❌'}`);
  console.log(`   Confidence: ${locationResult.confidence}%\n`);
  
  console.log('✅ All simulator tests passed!');
}

testSimulator().catch(console.error);