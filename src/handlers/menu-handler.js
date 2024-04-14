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
    const { id } = ctx.from;
    await ctx.reply(text.start.make_menu, mainButton);
    await ctx.reply(text.menu.main, inviteButton(id));
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.balance, async (ctx) => {
  try {
    const { id, first_name } = ctx.from;
    const user = await dbService.getUser(String(id), first_name);
    await ctx.replyWithHTML(
      text.menu.balance.balance +
        user.balance +
        " $MELL" +
        text.menu.balance.referals +
        user.referals +
        text.menu.balance.text,
      inviteButton(id)
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
    await ctx.replyWithHTML(
      text.menu.wallet.address +
        `<code>${user.address}</code>` +
        text.menu.wallet.text
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
    await ctx.replyWithHTML(
      text.menu.terms.ru.start +
        `<code>${process.env.BOT_URL}?start=${id}</code>` +
        text.menu.terms.ru.end,
      inviteButton(id)
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.terms.eng, async (ctx) => {
  try {
    const { id } = ctx.from;
    await ctx.replyWithHTML(
      text.menu.terms.eng.start +
        `<code>${process.env.BOT_URL}?start=${id}</code>` +
        text.menu.terms.eng.end,
      inviteButton(id)
    );
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears(text.main_button.twitter, async (ctx) => {
  try {
    const { id } = ctx.from;
    await ctx.replyWithHTML(text.menu.twitter, inviteButton(id));
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.on(message("text"), async (ctx, next) => {
  try {
    const { id } = ctx.from;
    await ctx.reply(text.start.make_menu, mainButton);
    await ctx.reply(text.menu.main, inviteButton(id));
    return next();
  } catch (error) {
    console.log(error);
  }
});

export default menuHandler;
