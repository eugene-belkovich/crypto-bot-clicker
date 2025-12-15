import {Context, InlineKeyboard, InputFile} from 'grammy';
import {config} from '../config';
import path from 'path';

const userLastMessage: Record<number, number> = {};

const WELCOME_IMAGE = path.join(process.cwd(), 'image', 'welcome.jpeg');

export const getPlayKeyboard = () => {
    return new InlineKeyboard().webApp('Play', config.miniAppUrl);
};

export const replyWithGame = async (ctx: Context, text: string) => {
    const userId = ctx.from?.id;

    if (userId && userLastMessage[userId]) {
        try {
            await ctx.api.editMessageReplyMarkup(userId, userLastMessage[userId], {
                reply_markup: undefined
            });
        } catch {
            // Ignore - previous message may be deleted or edited
        }
    }

    try {
        const message = await ctx.replyWithPhoto(new InputFile(WELCOME_IMAGE), {
            caption: text,
            reply_markup: getPlayKeyboard(),
            parse_mode: 'HTML'
        });

        if (userId) {
            userLastMessage[userId] = message.message_id;
        }
    } catch (error) {
        console.error('Failed to send welcome photo:', error);
        const message = await ctx.reply(text, {
            reply_markup: getPlayKeyboard(),
            parse_mode: 'HTML'
        });

        if (userId) {
            userLastMessage[userId] = message.message_id;
        }
    }
};
