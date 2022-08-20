import { Interaction } from 'discord.js';

import { DiscordCommand } from '../';

export const truth: DiscordCommand = {
  name: 'truth',
  description: 'says truths',
  handler: async (interaction: Interaction) => {
    if (interaction.isCommand()) await interaction.reply(`Marta puto`);
  },
};
