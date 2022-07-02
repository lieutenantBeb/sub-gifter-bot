const profileModel = require('../models/profileSchema');

module.exports = {
    name: 'checksubs',
    aliases: [],
    description: "Check how many subs someone has.",
    async execute(client, message, args, cmd, discord, profileData){
        const target = message.mentions.users.first()
        if (!message.mentions.users.first()){
            message.channel.send(`${message.author} has ${profileData.subs} subs!`)
        }else if (message.mentions.users.first()){
            try{
                const targetData = await profileModel.findOne({ userID: target.id});
                
                if(!targetData) return message.channel.send("That streamer isn't partnered yet.");
    
                message.channel.send(`${target} has ${targetData.subs} subs!`)
                }catch(err){
                    console.log(err);
                } 
            }else {
            message.channel.send('What???')
        }    
    }
}