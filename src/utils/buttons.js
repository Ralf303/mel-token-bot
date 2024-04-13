import { Key, Keyboard } from "telegram-keyboard";
import text from "../../local.json" assert { type: "json" };
import { config } from "dotenv";
config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

const inviteButton = (id) => {
  return Keyboard.inline([
    Key.url(text.invite_friend, `${process.env.BOT_URL}?start=${id}`),
  ]);
};

const checkButton = (value) => {
  if (value === true) {
    return Keyboard.inline([Key.callback(text.check_subscribe.check, "check")]);
  }
  return Keyboard.inline([
    Key.callback(text.check_subscribe.check, `ref_${value}`),
  ]);
};

const mainButton = Keyboard.make([
  [text.main_button.main],
  [text.main_button.walet, text.main_button.balance],
]).reply();

const stopButton = Keyboard.make([[text.scenes.stop]]).reply();

export { inviteButton, checkButton, mainButton, stopButton };