const Discord = require("discord.js");
require("dotenv").config();


const { Client, Intents } = require('discord.js');

//const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')

const client = new Client({ intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const mongoose = require("mongoose")


client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
});

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //userFindAndModify: false
}).then(() =>{
    console.log('Connected to Database');
}).catch((err) =>{
    console.log(err);
})


client.login(process.env.DISCORDTOKEN)


