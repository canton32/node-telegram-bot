const path = require('path')
const { Client } = require('tdlnode')
const getBinaryPath = require('tdl-binary')

const api_id = '3573285'
const api_hash = '0be177e6596ecb54ec01b3b54a8b5c99'
const token = process.env.TELEGRAM_BOT_TOKEN
const configuration = {
    path_to_binary_file: getBinaryPath(),
}
const phone_number = '+13234127641'
// const api_id = '3262137'
// const api_hash = 'fd456064202c672d2dd66a51a484e98a'
// const token = '1748350820:AAGtg56EH-cetNaR7J-tZiY1xADKkAShn7c'
// const configuration = {
//     path_to_binary_file: path.resolve(__dirname, '../tdlib_new/lib/libtdjson'),
//     database_directory: path.resolve(__dirname, '../tdlib_new/storage'),
//     files_directory: path.resolve(__dirname, '../tdlib_new/downloads'),
//     log_file_path: path.resolve(__dirname, '../tdlib_new/logs/tdl.log'),
// }

const up = async () => {
    try {
        const client = new Client({ api_id, api_hash, phone_number }, configuration);

        // client.on('updateSupergroup', update => {
        //     console.log(update)
        //     // messageAction(chat_id, last_message)
        // })

        // client.on('updateChatLastMessage', update => {
        //     console.log(update.last_message.content.text)
        //     // messageAction(chat_id, last_message)
        // })

        await client.init()

        client.on('updateNewMessage', async (update) => {
            // console.log(update);
            const message = update.message;
            const text = message.content.text.text;
            if (text) {
                console.log("Received message:", message.content.text.text);
                const prefix = /^\/invoice/g;
                if (prefix.test(text)) {
                    console.log("invoice called");
                    try {

                        console.log("main");

                        // const sentMessage = await client.fetch({
                        //     '@type': 'sendMessage',
                        //     chat_id: message.chat_id, //groupInfo.type.supergroup_id,
                        //     reply_to_messag_id: message.id,
                        //     input_message_content: {
                        //         '@type': 'inputMessagePhoto',
                        //         photo: {
                        //             '@type': 'inputFileLocal',
                        //             path: 'maxresdefault.png',
                        //         },
                        //         thumbnail: {
                        //             '@type': 'InputFile',
                        //             path: 'maxresdefault.png',
                        //             width: 150,
                        //             height: 150,
                        //         },
                        //         width: 150,
                        //         height: 150,
                        //         caption: {
                        //             '@type': 'formattedText',
                        //             text: "This is my photo <br> <a>https://pay.com</a>",
                        //         }
                        //     }
                        // });

                        console.log("invoice complete")
                    } catch (e) {
                        console.log(e);
                    }

                }
            }
        })
    } catch (e) {
        console.log(e);

    }

    // const chats = await client.fetch({
    //     '@type': 'getChats',
    //     'offset_order': '9223372036854775807',
    //     'offset_chat_id': 0,
    //     'limit': 100,
    // })

    // console.log('chats', chats)
    // const chats = await client.fetch({
    //     '@type': 'getChats',
    //     'offset_order': '9223372036854775807',
    //     'offset_chat_id': 0,
    //     'limit': 100,
    // })
    // try {
    //     const chat = await client.fetch({
    //         '@type': 'createNewSupergroupChat',
    //         'title': 'MySupergroup'
    //     })
    // } catch (e) {
    //     console.log(e);
    // }


    // try {
    // const result = await client.fetch({
    //   '@type': 'addChatMember',
    //   'chat_id': -1001457719567,
    //   // 'chat_id': -1001423746637,
    //   'user_id': 1612890713,
    //   // 'user_id': 1779363975
    // })

    //   const result = await client.fetch({
    //     '@type': 'transferChatOwnership',
    //     'chat_id': -1001457719567,
    //     'user_id': 1612890713,
    //   })

    //   console.log('result', result)
    // } catch(e){
    //   console.log(e)
    // }

    // console.log('chat', chat)

    // console.log(chats)

    // client.stop()
}

up()