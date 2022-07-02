const profileModel = require("../models/profileSchema");
module.exports = {
    name: 'revoke',
    aliases: [],
    description: "Take people's subs away when they are being cringe.",
    async execute(client, message, args, Discord, cmd, profileData){
        if(!args.length) return message.channel.send('What??');
        
        const amount = args[1];
        const target = message.mentions.users.first();

        if(!target) return message.channel.send('Who??')

        if (amount % 1 != 0){
            message.channel.send("Can't take away fractions of subs, idot.")
        }else if (target == message.author.id){
            message.channel.send('You really wanna do that?')
        }else if (target == 940820821193154611){
            message.channel.send("I don't got none anyway.")
        }else if (amount <= 0){
            message.channel.send("Nice try, bud.")
        }else{
         
         try{
            const targetData = await profileModel.findOne({ userID: target.id});
            if(!targetData) return message.channel.send("That streamer isn't partnered yet.");
            if(targetData.subs - amount < 0){
                message.channel.send("They don't have that many subs!");
            }else{
                await profileModel.findOneAndUpdate({
                userID: target.id,
            }, {
                $inc: {
                    subs: -amount,
                },
            });
            message.channel.send(`${target} lost ${amount} subs!`);
            }
            
         }catch(err){
            console.log(err)
        }
         
        } 

        

    }
}