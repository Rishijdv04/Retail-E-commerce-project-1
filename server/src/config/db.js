import mongoose from 'mongoose';

let memoryServer = null;

export async function connectDB() {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swiftcart';

  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection disconnected');
  });

  // Attempt connection to configured URI first
  try {
    console.log(`[MongoDB] Connecting to ${primaryUri}...`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to failover if no local daemon is running
    });
    return mongoose.connection;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${primaryUri}): ${err.message}`);

    console.log('[MongoDB] ⚡ Starting in-memory embedded MongoDB (MongoMemoryServer)...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      console.log(`[MongoDB] Embedded MongoDB running at: ${memUri}`);
      await mongoose.connect(memUri);
      return mongoose.connection;
    } catch (memErr) {
      console.error('[MongoDB] Failed to start embedded MongoDB:', memErr.message);
      if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
        throw err;
      }
      throw memErr;
    }
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Error during disconnect:', err.message);
  }
}
