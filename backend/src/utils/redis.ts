import { createClient } from 'redis';

let redisClient: any = null;

// Only create Redis client if REDIS_URL is explicitly set
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err: any) => {
    console.error('❌ Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
  });
}

export const connectRedis = async (): Promise<void> => {
  if (!redisClient) {
    console.log('⚠️ Redis not configured, continuing without cache...');
    return;
  }
  
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.log('⚠️ Redis not available, continuing without cache...');
    // Don't throw error in development - just log and continue
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }
  
  try {
    await redisClient.quit();
    console.log('✅ Redis disconnected successfully');
  } catch (error) {
    console.error('❌ Redis disconnection failed:', error);
    throw error;
  }
};

export { redisClient }; 