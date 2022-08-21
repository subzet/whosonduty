import { Message } from 'discord.js';

import { discordChannelService } from '../../service/discord-channel';
import { uuid } from '../../util';

export const rotationMessageHandler = async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  const rotationChannels = await discordChannelService.getChannels();

  const isRotationChannel = rotationChannels.includes(message.channelId);

  if (!isRotationChannel) {
    return;
  }

  const responsible = await discordChannelService.getResponsible(
    message.channelId
  );

  if (message.author.id === responsible) {
    return;
  }

  const threadChannel = await message.startThread({ name: uuid() });

  await threadChannel.send(`<@${responsible}> will take care of this.`);
};
