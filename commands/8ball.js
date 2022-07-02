const {eightBall} = require("../resources/answers.json")

module.exports = {
    name: '8ball',
    aliases: [],
    description: "8 Ball tells all ",
    async execute(client, message, args, Discord){
        const rando = randi(0, eightBall.length - 1)
        message.channel.send(eightBall[rando])
    }
}

function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }