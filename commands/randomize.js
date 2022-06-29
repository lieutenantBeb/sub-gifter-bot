module.exports = {
    name: 'randomize',
    aliases: [],
    description: "Choose what to do ",
    async execute(client, message, args, Discord){
        var activityList = [];
        const filter = m => m.content.startsWith('+');
        message.channel.send('List activities you would like to do, you have 20 seconds. (Type + before your activity)')
        const collector = message.channel.createMessageCollector({ filter, time: 20000 })

        collector.on('collect', m => {
            const activity = m.content.slice(1);
            console.log(`${m.author.username}: ${m.content}`)
            activityList.push(activity)
        });

        collector.on('end', collected => {
            console.log(`${collected.size} activities entered!`);
            const selection = randi(0, activityList.length)
            return message.channel.send(`I choose ${activityList[selection]}!`)
        });
    }
}

function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }