const profileModel = require("../models/profileSchema");
module.exports = {
    name: 'gift',
    aliases: [],
    description: "Gift a person subscribers",
    async execute(client, message, args, Discord, cmd, profileData){
        if(!args.length) return message.channel.send('What??');
        
        const amount = args[1];
        const target = message.mentions.users.first();

        if(!target) return message.channel.send('Who??')

        if (amount % 1 != 0){
            message.channel.send("Can't have fractions of subs, idot.")
        }else if (target == message.author.id){
            message.channel.send('Nice try bud.')
        }else if (target == 940820821193154611){
            message.channel.send("Thanks, but I don't need any subs.")
        }else if (amount <= 0){
            message.channel.send("Don't try to take people's subs away! :(")
        }else{
         
         try{
            const targetData = await profileModel.findOne({ userID: target.id});
            if(!targetData) return message.channel.send("That streamer isn't partnered yet.");

            await profileModel.findOneAndUpdate({
                userID: target.id,
            }, {
                $inc: {
                    subs: amount,
                },
            });
            message.channel.send(`Gifted ${args[0]} ${amount} subs!`);
        }catch(err){
            console.log(err)
        }
         
        } 

        

    }
}