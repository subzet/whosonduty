import { Message } from 'discord.js';

import { discordChannelService, discordThreadService } from '../../service';

const exit = 'SOLVED ✅';

export const incidentThreadSolutionMessageHandler = async (
  message: Message
) => {
  if (message.author.bot) {
    return;
  }

  if (!message.channel.isThread()) {
    return;
  }

  const thread = await discordThreadService.findUnsolvedThread(
    message.channelId
  );

  if (!thread) {
    return;
  }

  const threadRotation = await discordChannelService.getRotation(
    thread.channelId
  );

  const isSolvable =
    (thread?.ownerId === message.author.id ||
      threadRotation?.responsible.includes(message.author.id)) &&
    message.content === exit;

  if (!isSolvable) {
    return;
  }

  await discordThreadService.solveThread(
    message.channelId,
    thread.channelId,
    message.author.id
  );

  await message.channel.delete();
};
