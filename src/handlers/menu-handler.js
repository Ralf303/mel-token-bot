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

menuHandler.hears("🗒 Главная", async (ctx) => {
  try {
    const { id } = ctx.from;
    await ctx.reply(text.start.make_menu, mainButton);
    await ctx.reply(text.menu.main, inviteButton(id));
    return;
  } catch (error) {
    console.log(error);
  }
});

menuHandler.hears("💰 Баланс", async (ctx) => {
  try {
    const { id, first_name } = ctx.from;
    const user = await dbService.getUser(String(id), first_name);
    await ctx.replyWithHTML(
      `Твой айди: <code>${id}</code>\n` +
        text.menu.balance.balance +
        user.balance +
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

menuHandler.hears("👛 Кошелек", async (ctx) => {
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
