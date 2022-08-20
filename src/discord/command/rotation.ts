import { Interaction } from 'discord.js';

import { discordChannelService } from '../../service/discord-channel';
import { DiscordCommand } from '../types';

export const rotation: DiscordCommand = {
  name: 'rotation',
  description: 'Creates a channel rotation',
  handler: async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    const channelRotation =
      await discordChannelService.findOrCreateChannelRotation(
        interaction.channelId,
        'Rotation',
        ['1', '2', '3']
      );

    interaction.reply(
      `Channel rtation created ${JSON.stringify(channelRotation)}`
    );
  },
};
