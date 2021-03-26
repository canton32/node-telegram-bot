require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

telegram.on("text", (message) => {
  telegram.sendMessage(message.chat.id, "Hello world");
});
