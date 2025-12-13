import mongoose, { ConnectOptions } from 'mongoose';
import logger from './logger';

export const connectToDatabase = async (config?: ConnectOptions): Promise<typeof mongoose | false> => {
  try {
    mongoose.set('strictQuery', false);

    const connection = await mongoose.connect(process.env.MONGODB_URI!, { ...config });
    logger.info('Connected to MongoDB');
    return connection;
  } catch (error: unknown) {
    logger.error('Failed to connect to MongoDB:', error);
    return false;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};
