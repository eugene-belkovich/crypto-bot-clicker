import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../src/models/user.model';
import { Click } from '../src/models/click.model';

async function seedReset() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        console.log('Resetting collections...');

        const userCount = await User.countDocuments();
        const clickCount = await Click.countDocuments();

        await User.deleteMany({});
        await Click.deleteMany({});

        console.log(`Deleted ${userCount} users`);
        console.log(`Deleted ${clickCount} clicks`);
        console.log('\nReset completed successfully!');
    } catch (error) {
        console.error('Reset failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedReset();
