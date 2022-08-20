import { Interaction } from 'discord.js';

import { DiscordCommand } from '../';

export const ping: DiscordCommand = {
  name: 'ping',
  description: 'Replies with pong',
  handler: async (interaction: Interaction) => {
    if (interaction.isCommand()) await interaction.reply('Pong!');
  },
};
