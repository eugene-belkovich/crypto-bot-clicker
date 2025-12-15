import 'dotenv/config';
import mongoose from 'mongoose';
import {User} from '../src/models/user.model';

const TELEGRAM_ID = '94986611';

async function unbanUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      {telegramId: TELEGRAM_ID},
      {
        $set: {
          isBanned: false,
          banReason: null,
          bannedAt: null,
        },
      },
      {new: true},
    );

    if (user) {
      console.log(`\nUser unbanned successfully:`);
      console.log(`  Telegram ID: ${user.telegramId}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Banned: ${user.isBanned}`);
      console.log(`  Score: ${user.score}`);
    } else {
      console.log(`\nUser with Telegram ID ${TELEGRAM_ID} not found`);
    }
  } catch (error) {
    console.error('Unban failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

unbanUser();
