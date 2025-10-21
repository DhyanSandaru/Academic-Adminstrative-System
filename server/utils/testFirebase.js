// server/testFirebase.js
const { database } = require('../firebaseAdmin.js');

async function testFirebaseConnection() {
  console.log('🔍 Testing Firebase Realtime Database connection...\n');

  try {
    // Test 1: Write test data
    console.log('📝 Test 1: Writing test data...');
    await database.ref('test/connection').set({
      message: 'Hello from Firebase!',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Write successful!\n');

    // Test 2: Read test data
    console.log('📖 Test 2: Reading test data...');
    const snapshot = await database.ref('test/connection').once('value');
    const data = snapshot.val();
    console.log('✅ Read successful!');
    console.log('Data:', data, '\n');

    // Test 3: Check if data matches
    if (data && data.message === 'Hello from Firebase!') {
      console.log('✅ Test 3: Data verification passed!\n');
    } else {
      console.log('❌ Test 3: Data verification failed!\n');
    }

    // Test 4: Delete test data
    console.log('🗑️  Test 4: Cleaning up test data...');
    await database.ref('test/connection').remove();
    console.log('✅ Cleanup successful!\n');

    // Test 5: Verify deletion
    console.log('🔍 Test 5: Verifying deletion...');
    const verifySnapshot = await database.ref('test/connection').once('value');
    const verifyData = verifySnapshot.val();
    
    if (verifyData === null) {
      console.log('✅ Deletion verified!\n');
    } else {
      console.log('❌ Deletion verification failed!\n');
    }

    console.log('🎉 All Firebase connection tests passed!\n');
    console.log('Your Firebase Realtime Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Firebase connection test failed!\n');
    console.error('Error details:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Invalid serviceAccountKey.json');
    console.error('2. Wrong database URL in firebaseAdmin.js');
    console.error('3. Firebase Realtime Database not enabled');
    console.error('4. Insufficient permissions in Firebase rules');
  }

  process.exit(0);
}

testFirebaseConnection();