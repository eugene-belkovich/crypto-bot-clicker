import { Context, InlineKeyboard, InputFile } from "grammy";
import { config } from "../config";
import path from "path";

const userLastMessage: Record<number, number> = {};

const WELCOME_VIDEO = path.join(process.cwd(), "image", "welcome.mp4");

export const getPlayKeyboard = () => {
  return new InlineKeyboard().webApp("Play", config.miniAppUrl);
};

export const replyWithGame = async (ctx: Context, text: string) => {
  const userId = ctx.from?.id;

  if (userId && userLastMessage[userId]) {
    try {
      await ctx.api.editMessageReplyMarkup(userId, userLastMessage[userId], {
        reply_markup: undefined,
      });
    } catch (error) {
      console.error("Unexpected error removing keyboard:", error);
    }
  }

  const message = await ctx.replyWithVideo(new InputFile(WELCOME_VIDEO), {
    caption: text,
    reply_markup: getPlayKeyboard(),
    parse_mode: "HTML",
  });

  if (userId) {
    userLastMessage[userId] = message.message_id;
  }
};
