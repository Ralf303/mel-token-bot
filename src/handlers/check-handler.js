import { Composer } from "telegraf";
import { message } from "telegraf/filters";
import text from "../../local.json" assert { type: "json" };
import { checkButton } from "../utils/buttons.js";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const checkHandler = new Composer();

checkHandler.on(message("text"), async (ctx, next) => {
  try {
    const { status } = await ctx.telegram.getChatMember(
      process.env.CHANNEL_ID,
      ctx.from.id
    );
    const notSubscribe =
      status !== "creator" && status !== "administrator" && status !== "member";

    if (notSubscribe) {
      await ctx.reply(text.subscribe, checkButton(true));
      return;
    }
    return next();
  } catch (error) {
    console.log(error);
  }
});

export default checkHandler;
