import {Composer} from 'grammy';
import {config} from '../config';
import {replyWithGame} from './utils';

const WELCOME_MESSAGE = `<b>🎮 Welcome to Crypto Clicker!</b>

Tap to earn crypto, upgrade your mining power, and compete with friends!

‣ Tap 👆 to collect coins
‣ Buy upgrades ⛏️ to boost your earnings
‣ Invite friends 👥 to earn bonus rewards
‣ Compete 🏆 on the leaderboard

Press the button below to start playing!`;

export const startHandler = new Composer();

startHandler.command('start', async ctx => {
  // Set "Play" button instead of hamburger menu for this chat
  await ctx.setChatMenuButton({
    menu_button: {
      type: 'web_app',
      text: 'Play',
      web_app: {url: config.miniAppUrl},
    },
  });

  await replyWithGame(ctx, WELCOME_MESSAGE);
});
