import { Key, Keyboard } from "telegram-keyboard";
import text from "../../local.json" assert { type: "json" };
import { config } from "dotenv";
config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const inviteButton = (id) => {
  const { reply_markup } = Keyboard.inline([
    Key.url(
      text.invite_friend,
      `https://t.me/share/url?url=${process.env.BOT_URL}?start=${id}`
    ),
  ]);
  return reply_markup;
};

const checkButton = (value) => {
  if (value === true) {
    const { reply_markup } = Keyboard.inline([
      Key.callback(text.check_subscribe.check, "check"),
    ]);
    return reply_markup;
  }

  const { reply_markup } = Keyboard.inline([
    Key.callback(text.check_subscribe.check, `ref_${value}`),
  ]);
  return reply_markup;
};

const mainButton = Keyboard.make([
  [text.main_button.main],
  [text.main_button.walet, text.main_button.balance],
  [text.main_button.terms.ru, text.main_button.terms.eng],
  [text.main_button.twitter],
]).reply();

const stopButton = Keyboard.make([[text.scenes.stop]]).reply();

export { inviteButton, checkButton, mainButton, stopButton };
