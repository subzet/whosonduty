import { Interaction } from 'discord.js';

import { DiscordCommand } from '../types';

export const ping: DiscordCommand = {
  name: 'ping',
  description: 'Replies with pong',
  handler: async (interaction: Interaction) => {
    console.log(interaction);

    if (interaction.isCommand()) {
      await interaction.reply('Pong!');
    }
  },
};
