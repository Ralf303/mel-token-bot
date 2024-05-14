import { Composer } from "telegraf";
import text from "../../local.json" assert { type: "json" };
import { inviteButton, mainButton } from "../utils/buttons.js";
import dbService from "../db/service.js";
import { message } from "telegraf/filters";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const menuHandler = new Composer();

menuHandler.hears(text.main_button.main, async (ctx) => {
  try {
    const keyboard = inviteButton(ctx.from.id);
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

menuHandler.hears(text.main_button.balance, async (ctx) => {
  try {
    const { id, first_name } = ctx.from;
    const keyboard = inviteButton(id);
    const user = await dbService.getUser(String(id), first_name);
    await ctx.replyWithPhoto(
      { source: "img/balance.png" },
      {
        caption:
          text.menu.balance.balance +
          user.balance +
          " $SKUF" +
          text.menu.balance.referals +
          user.referals +
          text.menu.balance.text,
        reply_markup: keyboard,
      }
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.walet, async (ctx) => {
  try {
    const { id, first_name } = ctx.from;
    const user = await dbService.getUser(String(id), first_name);
    await ctx.replyWithPhoto(
      { source: "img/wallet.png" },
      {
        caption:
          text.menu.wallet.address +
          `<code>${user.address}</code>` +
          text.menu.wallet.text,
        parse_mode: "HTML",
      }
    );
    await ctx.scene.enter("walletScene");
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.terms.ru, async (ctx) => {
  try {
    const { id } = ctx.from;
    const keyboard = inviteButton(id);
    await ctx.replyWithPhoto(
      { source: "img/terms.png" },
      {
        caption:
          text.menu.terms.ru.start +
          `<code>${process.env.BOT_URL}?start=${id}</code>` +
          text.menu.terms.ru.end,
        reply_markup: keyboard,
        parse_mode: "HTML",
      }
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.terms.eng, async (ctx) => {
  try {
    const { id } = ctx.from;
    const keyboard = inviteButton(id);
    await ctx.replyWithPhoto(
      { source: "img/terms.png" },
      {
        caption:
          text.menu.terms.eng.start +
          `<code>${process.env.BOT_URL}?start=${id}</code>` +
          text.menu.terms.eng.end,
        reply_markup: keyboard,
        parse_mode: "HTML",
      }
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.twitter, async (ctx) => {
  try {
    const { id } = ctx.from;
    const keyboard = inviteButton(id);
    await ctx.replyWithPhoto(
      { source: "img/main.png" },
      {
        caption: text.menu.twitter,
        reply_markup: keyboard,
      }
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.on(message("text"), async (ctx, next) => {
  try {
    const { id } = ctx.from;
    const keyboard = inviteButton(id);
    await ctx.reply(text.start.make_menu, mainButton);
    await ctx.replyWithPhoto(
      { source: "img/main.png" },
      {
        caption: text.menu.main,
        reply_markup: keyboard,
      }
    );
    return next();
  } catch (error) {
    console.log(error);
  }
});

export default menuHandler;
