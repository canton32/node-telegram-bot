require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

function telegram_user() {
  this.telegram_id = 0;
  this.telegram_username = null;
  this.telegram_firstname = null;
  this.telegram_lastname = null;
  this.some_array = [];
  this.some_other_array = []; //yes you can store arrays in objects
  this.store_some_message = null;
}

function auth_usr(telegram_id) {
  for (var i = 0; i < user_array.length; i++) {
    if (user_array[i].telegram_id === telegram_id) {
      return i; //return the user's position in the user_array
    }
  }
  return 0; //otherwise just return 0;
}

const user_array = [];
// user_array.push(new telegram_user());

//when bot receives a text message event, do something
telegram.on("text", async (message) => {
  //create a new user state object, if this user is new
  // if (auth_usr(message.from.id) === 0) {
  //   user_array.push(new telegram_user());
  //   user_array[user_array.length - 1].telegram_id = message.from.id;
  //   user_array[user_array.length - 1].telegram_username = message.from.username;
  //   user_array[user_array.length - 1].telegram_firstname =
  //     message.from.first_name;
  //   user_array[user_array.length - 1].telegram_lastname =
  //     message.from.last_name;
  //   //send a welcome message to the user PRIVATELY, so we don't pollute any group chats with spam (message.from.id)
  //   telegram.sendMessage(message.from.id, "Welcome Message", {
  //     parse_mode: "Markdown",
  //   });
  //   return;
  // }
  // console.log(message);
  //listen for a bot command
  if (message.text.toLowerCase().indexOf("/invoice") === 0) {
    //then change some state variable
    await telegram.sendMessage(message.from.id, "You entere some command", {
      parse_mode: "Markdown",
    });
    const payload = message.from.id + "_" + message.message_id;
    const prices = [{ label: 'product', amount: 10000 }]

    try {
      const result = await telegram.sendInvoice(message.from.id, "Test Payment", "Teset description",
        payload, "284685063:TEST:YmJlZTA1MGU2Mzg1", "pay",
        "USD", prices, {
        photo_url: "https://core.telegram.org/file/811140227/2/ZTXUngAbELM.193805/ba6aa233d1d4206207",
        photo_size: 19600,
        photo_width: 160,
        photo_height: 160
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }

  }
  //listen for some other bot command
});

telegram.on('pre_checkout_query', async (update) => {
  console.log(update);
  await telegram.answerPreCheckoutQuery(update.id, true);
});