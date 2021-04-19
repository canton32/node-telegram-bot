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
user_array.push(new telegram_user());

//when bot receives a text message event, do something
telegram.on("text", (message) => {
  //create a new user state object, if this user is new
  if (auth_usr(message.from.id) === 0) {
    user_array.push(new telegram_user());
    user_array[user_array.length - 1].telegram_id = message.from.id;
    user_array[user_array.length - 1].telegram_username = message.from.username;
    user_array[user_array.length - 1].telegram_firstname =
      message.from.first_name;
    user_array[user_array.length - 1].telegram_lastname =
      message.from.last_name;
    //send a welcome message to the user PRIVATELY, so we don't pollute any group chats with spam (message.from.id)
    telegram.sendMessage(message.from.id, "Welcome Message", {
      parse_mode: "Markdown",
    });
    return;
  }

  //listen for a bot command
  if (message.text.toLowerCase().indexOf("/some_command") === 0) {
    //then change some state variable
    user_array[auth_usr(message.from.id)].some_state = 1;
    //do some other weird stuff
    return;
  }
  //listen for some other bot command
  if (message.text.toLowerCase().indexOf("/some_other_command") === 0) {
    //then reply to the user with a message
    telegram.sendMessage(message.from.id, "you sent me some_other_command", {
      parse_mode: "Markdown",
    });
    //do some other weird stuff
    return;
  }
  //listen for a command with some text at the end of it
  if (message.text.toLowerCase().indexOf("/text_input") === 0) {
    //strip the command from the string, to get the user_text
    var user_text = message.text.replace("/text_input ", "");
    if (user_text === "/text_input") {
      //respond with "you didn't send me any text"
      telegram.sendMessage(message.from.id, "you didn't send me any text", {
        parse_mode: "Markdown",
      });
      return;
    } else {
      //respond with the text the user sent, user_text
      telegram.sendMessage(message.from.id, "you sent: " + user_text, {
        parse_mode: "Markdown",
      });
      return;
    }
  }
  //return a message to the user when some_state has been changed
  if (user_array[auth_usr(message.from.id)].some_state === 1) {
    //send this message privately
    telegram.sendMessage(message.from.id, "some_state has been changed to 1!", {
      parse_mode: "Markdown",
    });

    //or send it publicly, if user is interacting with this bot from a group / supergroup
    telegram.sendMessage(message.chat.id, "some_state has been changed to 1!", {
      parse_mode: "Markdown",
    });
    return;
  }
});
