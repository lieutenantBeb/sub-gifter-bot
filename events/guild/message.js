require("dotenv").config();
const profileModel = require('../../models/profileSchema');

module.exports = async (Discord, client, message) =>{
    
    const prefix = '-';
    if(message.author.id == '940820821193154611') console.log(message.content);

    if(!message.content.startsWith(prefix)) return;

    console.log(`${message.author.username}: ${message.content}`)

    let profileData;
    try{
        profileData = await profileModel.findOne({userID: message.author.id});
        if(!profileData){
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                subs: 0,
                bank: 0,
            });
            profile.save();
        }
    }catch (err){
        console.log(err);
    }

    

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (!cmd){
        message.channel.send('What do you want??');
        return
    }

    try {
        command.execute(client, message, args, cmd, Discord, profileData);
    } catch(err){
        message.reply("That command doesn't exist bro.");
        console.log(err);
    }
}