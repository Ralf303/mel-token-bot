import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import text from "../../local.json" assert { type: "json" };
import dbServise from "../db/service.js";
import { inviteButton, mainButton, stopButton } from "../utils/buttons.js";

const walletScene = new Scenes.BaseScene("walletScene");

walletScene.enter(async (ctx) => {
  try {
    await ctx.reply(text.scenes.wallet.input_adress, stopButton);
  } catch (error) {
    console.log(error);
  }
});

walletScene.hears("🚫 Отмена", async (ctx) => {
  try {
    const { id } = ctx.from;
    await ctx.reply(text.start.make_menu, mainButton);
    await ctx.reply(text.menu.main, inviteButton(id));
    await ctx.scene.leave();
  } catch (error) {
    console.log(error);
  }
});

walletScene.on(message("text"), async (ctx) => {
  try {
    const user = await dbServise.getUser(
      String(ctx.from.id),
      ctx.from.first_name
    );
    user.address = ctx.message.text;
    await user.save();
    await ctx.react("✍");
    await ctx.replyWithHTML(
      text.scenes.wallet.adress_complite.adress +
        `<code>${ctx.message.text}</code>` +
        text.scenes.wallet.adress_complite.text,
      mainButton
    );
    await ctx.scene.leave();
  } catch (error) {
    console.log(error);
  }
});

export default walletScene;
