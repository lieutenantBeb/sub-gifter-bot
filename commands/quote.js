const {quotes} = require('../resources/answers.json')

module.exports = {
    name: 'quote',
    aliases: [],
    description: "Random quote ",
    async execute(client, message, args, Discord){
        const rando = randi(0, quotes.length - 1);
        message.channel.send(quotes[rando])
    }
}

function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }