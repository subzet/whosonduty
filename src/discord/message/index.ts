import { Message } from 'discord.js';

import { discordChannelService } from '../../service/discord-channel';
import { environment } from '../../util';

export const messageHandler = async (message: Message) => {
  const isFromBot = message.author.id === environment.DISCORD_CLIENT_ID;

  const rotationChannels = await discordChannelService.getChannels();

  const isRotationChannel = rotationChannels.includes(message.channelId);

  if (isFromBot || !isRotationChannel) {
    return;
  }

  const responsible = await discordChannelService.getResponsible(
    message.channelId
  );

  message.reply(`This message belongs to <@${responsible}>`);
};
