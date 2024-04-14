import { Telegraf, session, Scenes } from "telegraf";
import rateLimit from "telegraf-ratelimit";
import dbService from "./src/db/service.js";
import indexHandler from "./src/handlers/index-handler.js";
import walletScene from "./src/scenes/wallet-scene.js";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const stage = new Scenes.Stage([walletScene]);
const bot = new Telegraf(process.env.BOT_TOKEN);

const start = async () => {
  try {
    await dbService.connect();

    bot.catch(async (err) => {
      console.log(`Error occurred: ${err}`);
    });
    bot.use(session());
    bot.use(stage.middleware());
    bot.use(
      rateLimit({
        window: 1000,
        limit: 5,
      })
    );
    bot.use(indexHandler);
    await bot.launch({
      webhook: { domain: process.env.WEB_HOOK_URL, port: 443 },
    });
  } catch (error) {
    console.log(error);
  }
};

start();
