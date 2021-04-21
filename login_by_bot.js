/*
* TDLib (Telegram Database library) authentication example
* with Node.js by [tdl](https://github.com/Bannerets/tdl) pakage.
*
* by mortezaataiy
*
*/

const { Client } = require('tdl')
const { TDLib } = require('tdl-tdlib-ffi')
const { API_ID, API_HASH, BOT_TOKEN } = require('./config.js');
const getBinPath = require('tdl-binary');

const myDebug = false; // if you want to see logs change this to true
const showSommeryLogs = true;
var authState = {};
// authState[user_id] = 'waitPhoneNumber'
// authState[user_id] = 'waitAuthCode'
// authState[user_id] = 'waitAuthPass'

const API_BOT_AUTH = {
  type: 'bot',
  token: BOT_TOKEN,           // in document say write this line but
  getToken: () => BOT_TOKEN   // if this line dont set pakase get error and dont work
}

const tdlib = new TDLib(getBinPath())

// BotClient:
const BotClient = new Client(tdlib, {
  apiId: API_ID,
  apiHash: API_HASH,
  databaseDirectory: '/api_bot/_td_database',
  filesDirectory: '/api_bot/_td_files'
})

var BotId;
try {

  BotClient.connect()
  BotClient.login(() => API_BOT_AUTH)
  BotClient.on('error', e => myError('Bot error', e))
  BotClient.on('update', u => {
    // console.log(u);
    if (u['_'] == 'updateNewMessage'
      && u.message
      && u.message.sender.user_id != BotId
      && u.message.content
      && u.message.content.text
      && u.message.content.text.text) {
      var txt = u.message.content.text.text;
      var user_id = u.message.sender.user_id;
      console.log('New message from bot:', txt);

      if (txt == '/start') {
        if (!UserClientstarted) {
          startUserClient(u.message.chat_id);
          UserClientstarted = true;
          console.log('User started');
        }
      }

      if (txt && txt.indexOf('/send') >= 0) {
        txt = txt.split(' c')[1];
        console.log("Authorizing:", txt, user_id);
        recivedAuthFromUser(txt, user_id);
      }
    }
    else if (u['_'] == 'updateOption'
      && u.name == 'my_id'
      && u.value
      && u.value['_'] == 'optionValueInteger'
      && u.value.value) {
      BotId = u.value.value;
      console.log('Bot message:', u);
      console.log('Bot Id', BotId);
    }
  })
} catch (error) {
  console.log(error);
}

function botSendMessage(text, user_id) {
  console.log('Sending from bot', text);
  BotClient.invoke({
    '_': "sendMessage",
    chat_id: user_id,
    disable_notification: false,
    from_background: true,
    input_message_content: {
      '_': "inputMessageText",
      text: { text: text },
      disable_web_page_preview: false,
      clear_draft: false
    }
  })
    .then(o => {
      console.log('Sent from bot', text);
    })
    .catch(e => console.log('Bot sent error:', e));
}

// UserClient:
var UserClientstarted = false;
var UserId = 0;
const UserClient = new Client(tdlib, {
  apiId: API_ID,
  apiHash: API_HASH,
  databaseDirectory: 'user/_td_database',
  filesDirectory: 'user/_td_files',
})

function startUserClient(user_id) { // user_id is user that start api bot
  console.log('Staring user:', user_id);

  UserClient.on('error', e => console.log('User error:', e));
  UserClient.on('update', u => {
    if (u['_'] == 'updateAuthorizationState') {
      if (u.authorization_state['_'] == 'authorizationStateWaitPhoneNumber') {
        console.log('Waiting phone number', user_id);
        authState[user_id] = "waitPhoneNumber";
        var txt = "plz send phone number like this:\n/send c+123456789012\n(char 'c' need!)";
        getAuthFromUser(authState[user_id], txt, user_id);
        return;
      }
      else if (u.authorization_state['_'] == 'authorizationStateWaitCode') {
        console.log('Waiting auth code:', user_id);
        authState[user_id] = "waitAuthCode";
        var txt = "plz send code like this:\n/send c12345\n(char 'c' need!)\n(if send code without a char with telegram the code has expired!)";
        getAuthFromUser(authState[user_id], txt, user_id);
        return;
      }
      else if (u.authorization_state['_'] == 'authorizationStateWaitPassword') {
        console.log('Auth passed:', user_id);
        authState[user_id] = "waitAuthPass";
        var txt = "plz send password like this:\n/send c12345\n(char 'c' need!)";
        getAuthFromUser(authState[user_id], txt, user_id);
        return;
      }
      else if (u.authorization_state['_'] == 'authorizationStateReady') {
        console.log('User ready');

        authState[user_id] = "Ready";
        var txt = "now you can send ping in private.";
        botSendMessage(authState[user_id] + ", " + txt, user_id);
        var objTemp = {
          '_': 'getMe'
        };

        UserClientAsyncInvode(objTemp)
          .then(result => {
            console.log('Invoking get me', result);
            UserId = result.id;
          })
          .catch(e => myError);

        return;
      }
      else {
        console.log('Auth failed:', u);
      }
      return;
    }
    else if (UserId
      && u['_'] == 'updateNewMessage'
      && u.message.content
      && u.message.content.text) {
      if (u.message.content.text.text) {
        UserClientRecivedText(u.message.content.text.text, u.message.chat_id);
      }
    }

    // console.log('User update', u, " UserId:", UserId);
  })

  UserClient.connect()
  UserClient.login(() => ({ type: 'user' }))
}
function UserClientInvode(objTemp, user_id_debug) {

  console.log('User invoking', objTemp);
  UserClient.invoke(objTemp)
    .then(o => {
      console.log('User invoking success:', o);
    })
    .catch(e => {
      if (e.message) {
        botSendMessage(e.message, user_id_debug);
      }
      console.log('User invoking error:', e);
    });
}
function UserClientAsyncInvode(objTemp) {
  return new Promise(function (res, rej) {
    async function AsyncInvode(objTemp) {
      console.log('User async invoking', objTemp);
      try {
        const result = await UserClient.invoke(objTemp);
        res(result);
      } catch (error) {

      }

    }
    AsyncInvode(objTemp);
  })
}
function UserClientRecivedText(text, user_id) {
  console.log('Receved from User:', text);
  if (text.toUpperCase() == 'PING' && user_id == UserId)
    UserClientSendMessage('Pong', UserId);
}


function UserClientSendMessage(text, user_id) {
  console.log('Sending from user:', text);
  UserClient.invoke({
    _: 'sendMessage',
    chat_id: user_id,
    input_message_content: {
      _: 'inputMessageText',
      text: {
        _: 'formattedText',
        text: text
      }
    }
  })
    .then(o => {
      console.log('Send success:', o);
    })
    .catch(e => {
      if (e.message) {
        botSendMessage(e.message, user_id);
      }
      console.log('User sending error', e);
    });
}
// send what auth need from api bot to user
function getAuthFromUser(thisAuthState, txt, user_id) {
  botSendMessage(thisAuthState + ", " + txt, user_id);
}
// proccess recived auth data from api bot
function recivedAuthFromUser(input, user_id) {
  var type = '';
  var dataType = '';
  switch (authState[user_id]) {
    case 'waitPhoneNumber':
      type = 'setAuthenticationPhoneNumber';
      dataType = 'phone_number';
      break;
    case 'waitAuthCode':
      type = 'checkAuthenticationCode';
      dataType = 'code';
      break;
    case 'waitAuthPass':
      type = 'checkAuthenticationPassword';
      dataType = 'password';
      break;
  }
  if (type && input && dataType) {
    var objTemp = {
      "_": type
    };
    objTemp[dataType] = input;
    UserClientInvode(objTemp, user_id);
  }
  else {
    console.log('type or input or dataType is empty, type:', type);
    console.log('input', input);
    console.log('dataType', dataType);
    console.log('user_id', user_id);
  }
}
