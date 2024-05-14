import { Composer } from "telegraf";
import text from "../../local.json" assert { type: "json" };
import dbService from "../db/service.js";
import { inviteButton, checkButton, mainButton } from "../utils/buttons.js";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const commandHandler = new Composer();

commandHandler.start(async (ctx) => {
  try {
    const keyboard = inviteButton(ctx.from.id);
    const value = ctx?.payload;
    const { id, first_name } = ctx.from;
    const isNew = await dbService.check(String(id), first_name);
    const { status } = await ctx.telegram.getChatMember(
      process.env.CHANNEL_ID,
      ctx.from.id
    );
    const notSubscribe =
      status !== "creator" && status !== "administrator" && status !== "member";

    if (value && isNew) {
      if (notSubscribe) {
        await ctx.reply(text.subscribe, checkButton(value));
      } else {
        const referal = await dbService.getUser(value);
        referal.balance += 111;
        referal.referals += 1;
        await referal.save();
        await ctx.reply(text.start.invite + referal.firstname, mainButton);
        await ctx.replyWithPhoto(
          { source: "img/main.png" },
          {
            caption: text.menu.main,
            reply_markup: keyboard,
          }
        );
        await ctx.telegram.sendMessage(
          referal.id,
          text.start.referal + referal.referals
        );
      }

      return;
    }

    if (notSubscribe) {
      await ctx.reply(text.subscribe, checkButton(true));
      return;
    }

    await ctx.reply(text.start.make_menu, mainButton);

    await ctx.replyWithPhoto(
      { source: "img/main.png" },
      {
        caption: text.menu.main,
        reply_markup: keyboard,
      }
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

export default commandHandler;
