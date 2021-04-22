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
  console.log(message);
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

const URLs = [];
// Listener (handler) for telegram's /bookmark event
telegram.onText(/\/bookmark/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(" ")[1];
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  if (url === undefined) {
    telegram.sendMessage(chatId, "Please provide URL of article!");
    return;
  }

  URLs.push(url);
  telegram.sendMessage(chatId, "URL has been successfully saved!");
});

telegram.onText(/\/keyboard/, (msg) => {
  telegram.sendMessage(msg.chat.id, "Alternative keyboard layout", {
    reply_markup: {
      keyboard: [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  });
});

telegram.onText(/\/label/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(" ")[1];

  if (url === undefined) {
    telegram.sendMessage(chatId, "Please provide URL of article!");
    return;
  }

  tempSiteURL = url;
  telegram.sendMessage(chatId, "URL has been successfully saved!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Development",
            callback_data: "development",
          },
          {
            text: "Lifestyle",
            callback_data: "lifestyle",
          },
          {
            text: "Other",
            callback_data: "other",
          },
        ],
      ],
    },
  });
});

const URLLabels = [];
telegram.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const category = callbackQuery.data;

  URLLabels.push({
    url: tempSiteURL,
    label: category,
  });

  tempSiteURL = "";

  telegram.sendMessage(
    message.chat.id,
    `URL has been labeled with category "${category}"`
  );
});

// Keyboard layout for requesting phone number access
const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "My phone number",
          request_contact: true,
          one_time_keyboard: true,
        },
      ],
      ["Cancel"],
    ],
  },
};

// Listener (handler) for retrieving phone number
telegram.onText(/\/phone/, (msg) => {
  telegram.sendMessage(
    msg.chat.id,
    "Can we get access to your phone number?",
    requestPhoneKeyboard
  );
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
