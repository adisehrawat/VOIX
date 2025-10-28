
/**
 * Initialize Smart Contract Global Config
 * This script initializes the globalConfigPda which is required before users can be created
 */

async function initializeGlobalConfig() {
    console.log('\n🚀 Starting Smart Contract Initialization...\n');
    
    
    try {
        
        // Step 1: Initialize Config - calling directly to see errors
        console.log('\n🔧 Step 1: Initializing Global Config...');
        // Import dependencies
        const { program } = require('../Singelton/index');
        const { PublicKey, SystemProgram } = require('@solana/web3.js');
        const fs = require('fs');
        
        const wallet = JSON.parse(fs.readFileSync("./src/admin_key.json", "utf-8"));
        const admin = require('@solana/web3.js').Keypair.fromSecretKey(new Uint8Array(wallet));
        
        const CONFIG_SEED = Buffer.from("config");
        const [globalConfigPda] = PublicKey.findProgramAddressSync(
            [CONFIG_SEED],
            program.programId
        );
        
        console.log('Admin Public Key:', admin.publicKey.toString());
        console.log('Global Config PDA:', globalConfigPda.toString());
        
        try {
            const tx = await program.methods
                .initializeConfig()
                .accounts({
                    admin: admin.publicKey,
                    globalConfig: globalConfigPda,
                    systemProgram: SystemProgram.programId,
                })
                .signers([admin])
                .rpc();
                
            console.log('✅ Global Config initialized successfully!');
            console.log('✅ Transaction signature:', tx);
            console.log('✅ globalConfigPda is now ready');
            console.log('\n🎉 Smart Contract setup complete!');
            console.log('📝 You can now create users with Solana wallets.\n');
        } catch (initError: any) {
            if (initError.message && initError.message.includes('already in use')) {
                console.log('✅ Config already initialized - this is OK!');
                console.log('📝 You can proceed with user creation.\n');
            } else {
                throw initError;
            }
        }
        
    } catch (error: any) {
        console.error('\n❌ Error during initialization:');
        
        if (error.message.includes('already in use')) {
            console.log('✅ Good news! Config is already initialized.');
            console.log('📝 You can proceed with user creation.\n');
        } else if (error.logs) {
            console.error('📜 Error logs:', error.logs);
        } else {
            console.error('Error:', error.message || error);
        }
        
        console.log('\n💡 Possible issues:');
        console.log('   1. Program not deployed to devnet');
        console.log('   2. Admin keypair incorrect');
        console.log('   3. Insufficient SOL in admin account');
        console.log('   4. Program ID mismatch\n');
    }
}

// Run the initialization
initializeGlobalConfig()
    .then(() => {
        console.log('✅ Script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });

