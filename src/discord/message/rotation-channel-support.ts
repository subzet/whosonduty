import { Message } from 'discord.js';
import { padStart } from 'lodash';

import { discordChannelService, discordThreadService } from '../../service';

export const rotationChannelSupportMessageHandler = async (
  message: Message
) => {
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

  const channelName = message.guild?.channels.cache.find(
    (channel) => channel.id === message.channelId
  )?.name as string;

  const threadCount = await discordThreadService.getThreadCount(
    message.channelId
  );

  const threadChannel = await message.startThread({
    name: `${channelName} ${padStart(threadCount.toString(), 5, '0')}`,
    autoArchiveDuration: 60 * 24, //Archives in 24 hours.
  });

  await discordThreadService.createThread(
    message.channelId,
    threadChannel.id,
    message.author.id
  );

  await threadChannel.send(
    `<@${responsible}> will take care of this. Type SOLVED✅ to close this thread, if not resolved it will be archived automatically in 24 hours.`
  );
};
