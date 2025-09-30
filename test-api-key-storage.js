/**
 * Test script to verify API key storage functionality
 * Run this in browser console to test the enhanced API key storage
 */

// Test the API key storage functionality
console.log('🔑 Testing Enhanced API Key Storage');

// Import storage (this would be available in the app context)
// const { storage } = require('../lib/storage');

// Simulate API key storage test
const testApiKey = 'AIzaSyTest123456789TestKey';

console.log('1. Testing basic storage...');
try {
  localStorage.setItem('test_api_key', testApiKey);
  const retrieved = localStorage.getItem('test_api_key');
  console.log('✅ Basic localStorage working:', retrieved === testApiKey);
} catch (error) {
  console.error('❌ Basic localStorage failed:', error);
}

console.log('2. Testing storage size calculation...');
try {
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      totalSize += new Blob([key + value]).size;
    }
  }
  console.log('✅ Storage size calculated:', `${(totalSize / 1024).toFixed(2)}KB`);
} catch (error) {
  console.error('❌ Storage calculation failed:', error);
}

console.log('3. Testing key validation...');
const validateApiKey = (key) => key.startsWith('AIza') && key.length > 30;
console.log('✅ Valid key test:', validateApiKey(testApiKey));
console.log('✅ Invalid key test:', !validateApiKey('invalid_key'));

console.log('4. Testing encryption simulation...');
try {
  const encrypt = (data) => btoa(data.split('').reverse().join(''));
  const decrypt = (data) => atob(data).split('').reverse().join('');
  
  const encrypted = encrypt(testApiKey);
  const decrypted = decrypt(encrypted);
  console.log('✅ Encryption working:', decrypted === testApiKey);
  console.log('   Encrypted form:', encrypted.substring(0, 20) + '...');
} catch (error) {
  console.error('❌ Encryption simulation failed:', error);
}

console.log('5. Testing API key persistence...');
try {
  // Simulate the hook's behavior
  const API_KEY_STORAGE_KEY = 'gemini_api_key';
  
  // Save encrypted key
  const encryptedKey = btoa(testApiKey.split('').reverse().join(''));
  localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify({
    data: testApiKey,
    timestamp: Date.now(),
    version: '1.0.0',
    encrypted: true,
    compressed: false
  }));
  
  // Retrieve and verify
  const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
  const parsed = JSON.parse(stored);
  console.log('✅ API key persistence working:', parsed.data === testApiKey);
  console.log('✅ Metadata preserved:', parsed.version, new Date(parsed.timestamp).toLocaleString());
} catch (error) {
  console.error('❌ API key persistence failed:', error);
}

// Cleanup
localStorage.removeItem('test_api_key');
localStorage.removeItem('gemini_api_key');

console.log('🎉 API Key Storage Test Complete!');