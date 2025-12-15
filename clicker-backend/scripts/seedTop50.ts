import 'dotenv/config';
import mongoose from 'mongoose';
import {User} from '../src/models/user.model';
import {Click} from '../src/models/click.model';

const firstNames = [
  'Alex',
  'Maria',
  'Ivan',
  'Elena',
  'Dmitry',
  'Anna',
  'Sergey',
  'Olga',
  'Nikolay',
  'Tatiana',
  'Pavel',
  'Yulia',
  'Andrey',
  'Natalia',
  'Viktor',
  'Ekaterina',
  'Mikhail',
  'Irina',
  'Alexey',
  'Svetlana',
  'Roman',
  'Oksana',
  'Konstantin',
  'Vera',
  'Denis',
  'Galina',
  'Vladislav',
  'Marina',
  'Artem',
  'Kristina',
  'Evgeny',
  'Alina',
  'Ilya',
  'Daria',
  'Oleg',
  'Polina',
  'Maxim',
  'Valeria',
  'Kirill',
  'Anastasia',
  'Anton',
  'Elizaveta',
  'Vladlen',
  'Sofia',
  'Ruslan',
  'Diana',
  'Bogdan',
  'Arina',
  'Timur',
  'Milana',
];

const lastNames = [
  'Ivanov',
  'Petrov',
  'Sidorov',
  'Smirnov',
  'Kuznetsov',
  'Popov',
  'Sokolov',
  'Lebedev',
  'Kozlov',
  'Novikov',
  'Morozov',
  'Volkov',
  'Alekseev',
  'Fedorov',
  'Dmitriev',
  'Yakovlev',
  'Sorokin',
  'Pavlov',
  'Andreev',
  'Nikolaev',
  'Egorov',
  'Orlov',
  'Makarov',
  'Tarasov',
  'Belov',
  'Grishin',
  'Kovalev',
  'Borisov',
  'Ilyin',
  'Kiselev',
  'Medvedev',
  'Markov',
  'Stepanov',
  'Frolov',
  'Zaitsev',
  'Vinogradov',
  'Gorbunov',
  'Kazakov',
  'Nikitin',
  'Voronov',
  'Baranov',
  'Savin',
  'Fomin',
  'Lukin',
  'Komarov',
  'Karpov',
  'Tikhonov',
  'Suvorov',
  'Ershov',
  'Zakharov',
];

async function seedTop50() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Click.deleteMany({});
    console.log('Cleared existing users and clicks');

    const users = [];
    const clicks = [];

    console.log('Creating 50 users with clicks...');

    for (let i = 0; i < 50; i++) {
      const score = 50 - i; // Scores from 50 to 1
      const telegramId = `seed_user_${100000 + i}`;
      const username = `${firstNames[i].toLowerCase()}_${lastNames[i].toLowerCase()}`;

      const user = {
        telegramId,
        username,
        firstName: firstNames[i],
        lastName: lastNames[i],
        score,
      };

      users.push(user);

      // Create clicks for this user (amount = score)
      const now = Date.now();
      for (let j = 0; j < score; j++) {
        clicks.push({
          userId: telegramId,
          timestamp: new Date(now - j * 100), // Each click 100ms apart
          x: Math.floor(Math.random() * 400),
          y: Math.floor(Math.random() * 600),
          metadata: {
            userAgent: 'Mozilla/5.0 (Seed Script)',
            hasTouchEvents: true,
            hasOrientation: true,
            hasOrientationEvent: false,
            hasMotionEvent: true,
            timeZone: 'Europe/Moscow',
          },
        });
      }
    }

    // Insert users
    console.log('Inserting users...');
    await User.insertMany(users);
    console.log(`Created ${users.length} users`);

    // Insert clicks
    console.log('Inserting clicks...');
    await Click.insertMany(clicks);
    console.log(`Created ${clicks.length} clicks`);

    // Verify
    const userCount = await User.countDocuments();
    const clickCount = await Click.countDocuments();
    console.log(`\nVerification:`);
    console.log(`- Users in database: ${userCount}`);
    console.log(`- Clicks in database: ${clickCount}`);

    // Show top 10 leaderboard
    console.log('\nTop 10 Leaderboard:');
    const topUsers = await User.find().sort({score: -1}).limit(10);
    topUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (@${user.username}) - ${user.score} points`);
    });

    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedTop50();
