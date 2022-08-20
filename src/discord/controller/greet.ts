import { Interaction } from 'discord.js';

import { DiscordCommand } from '../';

export const greet: DiscordCommand = {
  name: 'greet',
  description: 'greets people',
  handler: async (interaction: Interaction) => {
    if (interaction.isCommand())
      await interaction.reply(`Hello ${interaction.user.username}`);
  },
};
