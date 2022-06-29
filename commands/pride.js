const { MessageEmbed } = require("discord.js");

var flagName = ['LGBT', 'Agender', 'Aromantic', 'Asexual', 'Bisexual', 'Gay', 'Genderfluid', 'Intersex', 'Lesbian', 'Non-binary', 'Pansexual', 'Progress Pride', 'Transgender'];
var flagList = ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/1920px-Gay_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Agender_pride_flag.svg/1280px-Agender_pride_flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Aromantic_Pride_Flag.svg/1920px-Aromantic_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Asexual_Pride_Flag.svg/1920px-Asexual_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bisexual_Pride_Flag.svg/1920px-Bisexual_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gay_Men_Pride_Flag.svg/1920px-Gay_Men_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Genderfluidity_Pride-Flag.svg/1920px-Genderfluidity_Pride-Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Intersex_Pride_Flag.svg/1280px-Intersex_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Lesbian_Pride_pink_flag.svg/1920px-Lesbian_Pride_pink_flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Nonbinary_flag.svg/1280px-Nonbinary_flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pansexuality_Pride_Flag.svg/1920px-Pansexuality_Pride_Flag.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/LGBTQ%2B_rainbow_flag_Quasar_%22Progress%22_variant.svg/1920px-LGBTQ%2B_rainbow_flag_Quasar_%22Progress%22_variant.svg.png',
'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Transgender_Pride_flag.svg/1920px-Transgender_Pride_flag.svg.png']

module.exports = {
    name: 'pride',
    aliases: [],
    description: "Random pride flag ",
    async execute(client, message, args, Discord){
        const rando = randi(0, 12);
        console.log(rando)
        try{
        const prideEmbed = new MessageEmbed()
            .setImage(flagList[rando])
            .setFooter({text: flagName[rando], icon: flagList[rando]});
        
          await message.channel.send({embeds: [prideEmbed]})  
        } catch (err){
            console.log(err)
            return message.channel.send('Working on it')
        }
        
    }
}

function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }