const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const jsVoice = require('@discordjs/voice');

const player = jsVoice.createAudioPlayer();

const queue = new Map();
var songURL = {};
var msg = {};
var timeoutStatus = {};

module.exports = {
    name: 'play',
    aliases: ['stop', 'skip', 'dc', 'queue', 'q'],
    description: "Play a YouTube video ",
    async execute(client, message, args, cmd, Discord) {
        const voiceChannel = message.member.voice.channel.id;
        if (!message.member.voice.channel) return message.channel.send('You gotta be in a voice channel to play music.')
        const serverQueue = queue.get(message.guild.id)

        if (cmd === 'play') {
            if (!args.length) return message.channel.send('Play what?')

            if (ytdl.validateURL(args[0])) {
                console.log('URL accepted')
                const songInfo = await ytdl.getInfo(args[0])
                var song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    Time: formatSeconds(songInfo.videoDetails.lengthSeconds),
                }
            } else {
                const videoSearch = async (query) => {
                    const epoch = Date.now();
                    const videoResult = await ytSearch(query)
                    console.log(videoResult.videos.slice(0, 5))
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId(epoch + message.member.id)
                                .setPlaceholder('Select a video:')
                                .addOptions([
                                    {
                                        label: `${videoResult.videos[0].title}`,
                                        description: `${videoResult.videos[0].timestamp}`,
                                        value: '0',
                                    },
                                    {
                                        label: `${videoResult.videos[1].title}`,
                                        description: `${videoResult.videos[1].timestamp}`,
                                        value: '1',
                                    },
                                    {
                                        label: `${videoResult.videos[2].title}`,
                                        description: `${videoResult.videos[2].timestamp}`,
                                        value: '2',
                                    },
                                    {
                                        label: `${videoResult.videos[3].title}`,
                                        description: `${videoResult.videos[3].timestamp}`,
                                        value: '3',
                                    },
                                    {
                                        label: `${videoResult.videos[4].title}`,
                                        description: `${videoResult.videos[4].timestamp}`,
                                        value: '4',
                                    },
                                ]),
                        );
                    msg.ref = await message.channel.send({ content: 'Choose a song:', components: [row] })


                    client.on('interactionCreate', async interaction => {
                        if (!interaction.isSelectMenu()) return;

                        if (interaction.customId === epoch + message.member.id) {
                            var selection = Number(interaction.values[0])
                            await interaction.update({ content: `Selected: ${videoResult.videos[selection].title}`, components: [] });
                            console.log(interaction.values)
                            songURL.url = videoResult.videos[selection].url
                            console.log(typeof songURL.url)
                            selection = [];

                        }
                    })
                }

                videoSearch(args.join(' '))
                await sleep(5000)
                if (typeof songURL.url === 'undefined') return await msg.ref.edit({ content: "You didn't select in time!", components: [] })


                console.log(songURL.url)
                const songInfo = await ytdl.getInfo(songURL.url)
                var song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    Time: formatSeconds(songInfo.videoDetails.lengthSeconds),
                }
            }



            if (!serverQueue || serverQueue.songs.length == 0) {
                var queueConstructor = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };
                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);
                const serverQueue = queue.get(message.guild.id)

                try {
                    const connection = await connectToChannel(voiceChannel, message.member.guild);
                    queueConstructor.connection = connection
                    console.log(queueConstructor.connection)

                    videoPlayer(serverQueue.songs[0], message.guild, connection, message, serverQueue, msg)

                } catch (err) {
                    console.log(err)
                    queue.delete(message.guild.id)
                    return message.channel.send("Somethin happened idk...")
                }

            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return message.channel.send(`${song.title} has been added to the queue!`);
            }

        } else if (cmd === 'skip') {
            skipSong(message, serverQueue);
        } else if (cmd === 'stop') {
            stopSong(message, serverQueue, serverQueue.connection);
        } else if (cmd === 'dc') {
            dcBot(message, serverQueue, serverQueue.connection)
        } else if (cmd === 'queue' || cmd === 'q'){
            showQueue(message, serverQueue)
        }
    }
}


async function connectToChannel(channel, guild) {
    const connection = jsVoice.joinVoiceChannel({
        channelId: channel,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
    });
    try {
        await jsVoice.entersState(connection, jsVoice.VoiceConnectionStatus.Ready, 30e3);
        return connection;

    } catch (error) {
        connection.destroy();
        throw error;
    }
}

const videoPlayer = async (song, guild, connection, message, serverQueue, msg) => {
    console.log('Ran video player')
    if (typeof timeoutStatus !== 'undefined'){
        console.log('Timeout Cleared')
        clearTimeout(timeoutStatus)
        timeoutStatus = {};
    } ;
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = jsVoice.createAudioResource(stream)
    player.play(resource)
    connection.subscribe(player)

    player.on(jsVoice.AudioPlayerStatus.Idle, () => {
        serverQueue.songs.shift();
        console.log(serverQueue.songs)
        if (serverQueue.songs.length == 0) {
            player.removeAllListeners(jsVoice.AudioPlayerStatus.Idle)
            message.channel.send('Queue is empty :( ')
            timeoutStatus = setTimeout(() => {dcBot(message, serverQueue, connection)}, 600000)
            return
        }
        msg = undefined
        player.play(getNextResource(serverQueue.songs[0]))
        message.channel.send(`Now playing ${song.title}...`);
    });
    message.channel.send(`Now playing ${song.title}...`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const stopSong = (message, serverQueue) => {
    serverQueue.songs = [];
    player.stop()
    message.channel.send("Player stopped.")

}

const skipSong = (message, serverQueue) => {
    if (!serverQueue.songs) return message.channel.send('There are no songs in the queue.')
    player.stop()
    message.channel.send("Song skipped.")
}

const dcBot = (message, serverQueue, connection) => {
    serverQueue.songs = [];
    queue.delete(message.guild.id)
    connection.destroy()
    message.channel.send('Bot disconnected.')
}

const showQueue = (message, serverQueue) => {
    queueLength = serverQueue.songs.length;
    if (queueLength < 5){
        if (queueLength === 0 ){
            message.channel.send('No songs in Queue.')
        }else if (queueLength === 1 ) {
            message.channel.send(`Current queue:
            ${serverQueue.songs[0].title} -- ${serverQueue.songs[0].Time}`)
        }else if (queueLength === 2) {
            message.channel.send(`Current queue:
            ${serverQueue.songs[0].title} -- ${serverQueue.songs[0].Time}
            ${serverQueue.songs[1].title} -- ${serverQueue.songs[1].Time}`)
        }else if (queueLength === 3){
            message.channel.send(`Current queue:
            ${serverQueue.songs[0].title} -- ${serverQueue.songs[0].Time}
            ${serverQueue.songs[1].title} -- ${serverQueue.songs[1].Time}
            ${serverQueue.songs[2].title} -- ${serverQueue.songs[2].Time}`)
        }else if (queueLength === 4){
            message.channel.send(`Current queue:
            ${serverQueue.songs[0].title} -- ${serverQueue.songs[0].Time}
            ${serverQueue.songs[1].title} -- ${serverQueue.songs[1].Time}
            ${serverQueue.songs[2].title} -- ${serverQueue.songs[2].Time}
            ${serverQueue.songs[3].title} -- ${serverQueue.songs[3].Time}`)
        }
    }else{
        message.channel.send(`Next 5 songs in queue: 
        ${serverQueue.songs[0].title} -- ${serverQueue.songs[0].Time}
        ${serverQueue.songs[1].title} -- ${serverQueue.songs[1].Time}
        ${serverQueue.songs[2].title} -- ${serverQueue.songs[2].Time}
        ${serverQueue.songs[3].title} -- ${serverQueue.songs[3].Time}
        ${serverQueue.songs[4].title} -- ${serverQueue.songs[4].Time}`)   
    }
    
}

const getNextResource = (song) => {
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = jsVoice.createAudioResource(stream)
    return resource
}

const formatSeconds = (secsString) => {
    const secs = Number(secsString)
    var hours = Math.floor(secs/3600);
    var minutes = Math.floor(secs/60) % 60
    var seconds = secs % 60
	var Time = (hours < 10 ? "0" + hours : hours);
            Time += ":" + (minutes < 10 ? "0" + minutes : minutes);
            Time += ":" + (seconds < 10 ? "0" + seconds : seconds);
            return Time;
}