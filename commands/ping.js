module.exports = {
    name: 'ping',
    aliases: [],
    description: "this is a ping command",
    async execute(client, message, args, Discord){
        message.channel.send('pong');
    }
}