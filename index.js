require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Clear = require("codeday-clear");
const moment = require("moment");

const telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const clear = new Clear(
  "1YZiGaj3baaLU8IKVsASRIWaNF2oJNg0",
  "1COMnWyGnGBsNqkhaZ6WMBWB9UWZw6QZ"
);

telegram.on("text", (message) => {
  if (message.text.toLowerCase().indexOf("/codeday") === 0) {
    clear.getEventById("oo4QIuKQQTYA", (codedayEvent) => {
      var endsAt = moment(codedayEvent.ends_at * 1000);
      telegram.sendMessage(
        message.chat.id,
        "CodeDay ends *" + endsAt.fromNow() + "*!",
        {
          parse_mode: "Markdown",
        }
      );
    });
  }
});

telegram.on("inline_query", (query) => {
  telegram.answerInlineQuery(query.id, [
    {
      type: "article",
      id: "testarticle",
      title: "Hello world",
      input_message_content: {
        message_text:
          "Hello, world! This was sent from my super cool inline bot.",
      },
    },
  ]);
});
