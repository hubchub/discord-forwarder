require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');
const axios = require("axios")
const mainTelegramChannel = '-1001697984045'; // Main telegram channel ID
const telegramChatIds = ['-1001814498420'] // Add specific langauge chats here
const client = new Client({
    intents: [
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.Guilds, // I added these two Intents to enable messages to come through
        IntentsBitField.Flags.GuildMessages
    ]
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`); // Log if Discord bot is successfully started
})

client.on('messageCreate', (msg) => {
    console.log(msg) // this can be removed eventually
    // need to filter msg based on msg.channelId
	// only forward messages where the channelId is equal to the channelId of the Announcements channel
    axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, { // Post an annoucement into the main channel 
        chat_id: mainTelegramChannel,
        text: msg.content
    }).then((res) => {
        telegramChatIds.map( async (chat_id) => { // Take each language group
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/forwardMessage`, { // Post an annoucement
                chat_id: chat_id,
                from_chat_id: res.data.result.chat.id,
                message_id: res.data.result.message_id
            }).then((res) => {
                axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/pinChatMessage`, { // Pin announcement
                    chat_id: res.data.result.chat.id,
                    message_id: res.data.result.message_id // You can also add 'disable_notification: false' if notifications aren't needed
                }).then((res) => {
                    console.log(`${chat_id} ${res.data.ok ? 'ok' : 'failed'}`)
                }) 
            }).catch((err) => {
                console.log(err)
            })
        })
    }).catch((err) => {
        console.log(err)
    })
})

client.on('message', (msg) => {
    console.log(msg)
    axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, { // Post an annoucement into the main channel 
        chat_id: mainTelegramChannel,
        text: msg.content
    }).then((res) => {
        telegramChatIds.map( async (chat_id) => { // Take each language group
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/forwardMessage`, { // Post an annoucement
                chat_id: chat_id,
                from_chat_id: res.data.result.chat.id,
                message_id: res.data.result.message_id
            }).then((res) => {
                axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/pinChatMessage`, { // Pin announcement
                    chat_id: res.data.result.chat.id,
                    message_id: res.data.result.message_id // You can also add 'disable_notification: false' if notifications aren't needed
                }).then((res) => {
                    console.log(`${chat_id} ${res.data.ok ? 'ok' : 'failed'}`)
                }) 
            }).catch((err) => {
                console.log(err)
            })
        })
    }).catch((err) => {
        console.log(err)
    })
})

client.login(process.env.DISCORD_TOKEN); // Start discord bot
