const { MessageActionRow, MessageSelectMenu, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'dropdown',
    aliases: [],
    description: "dropdown test ",
    async execute(client, message, args, Discord) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            );
        message.channel.send({ content: "Super button below", components: [row] })

        client.on('interactionCreate', async interaction => {
            if (!interaction.isSelectMenu()) return;

            if ( interaction.customId === 'select') {
                await interaction.update({ content: `Selected ${interaction.values[0]}`, components: [] });
                console.log(interaction)
            }
        });
    }
}
