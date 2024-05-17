import { Composer } from "telegraf";
import text from "../../local.json" assert { type: "json" };
import dbService from "../db/service.js";
import { inviteButton, mainButton } from "../utils/buttons.js";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const actionsHandler = new Composer();

actionsHandler.action("check", async (ctx) => {
  try {
    const keyboard = inviteButton(ctx.from.id);
    const { status } = await ctx.telegram.getChatMember(
      process.env.CHANNEL_ID,
      ctx.from.id
    );
    const notSubscribe =
      status !== "creator" && status !== "administrator" && status !== "member";

    if (notSubscribe) {
      await ctx.answerCbQuery(text.check_subscribe.not_subscribe);
      return;
    }

    await ctx.deleteMessage();
    await ctx.reply(text.start.make_menu, mainButton);
    await ctx.replyWithPhoto(
      { source: "img/main.png" },
      {
        caption: text.menu.main,
        reply_markup: keyboard,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

actionsHandler.action(/ref_([^]+)/, async (ctx) => {
  try {
    const keyboard = inviteButton(ctx.from.id);
    const { status } = await ctx.telegram.getChatMember(
      process.env.CHANNEL_ID,
      ctx.from.id
    );
    const notSubscribe =
      status !== "creator" && status !== "administrator" && status !== "member";

    if (notSubscribe) {
      await ctx.deleteMessage();
      await ctx.answerCbQuery(text.check_subscribe.not_subscribe);
      return;
    }
    await ctx.deleteMessage();
    const data = ctx.match[1].split("_");
    const referal = await dbService.getUser(data);
    await ctx.reply(text.start.invite + referal.firstname, mainButton);
    await ctx.replyWithPhoto(
      { source: "img/main.png" },
      {
        caption: text.menu.main,
        reply_markup: keyboard,
      }
    );
    referal.balance += 111;
    referal.referals += 1;
    await referal.save();
    await ctx.telegram.sendMessage(
      referal.id,
      text.start.referal + referal.referals
    );
  } catch (error) {
    console.log(error);
  }
});

export default actionsHandler;
