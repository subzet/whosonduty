import { Interaction, Message, TextBasedChannel } from 'discord.js';

import { discordChannelService, discordUserService } from '../../service';
import { Errors, ServerError } from '../../util';
import { DiscordCommand } from '../types';

const isValidParticipantsAnswer = (message: Message) => {
  if (message.mentions.users.size === 0) {
    throw Errors.invalidOperation(`No mentions in message`);
  }
};

const getUsersFromMessage = (message: Message) => {
  return message.mentions.users.map((user) => user.id);
};

const getPromptsAnswers = async (
  channel: TextBasedChannel,
  prompts: string[],
  messageFilter?: (message: Message) => boolean,
  promptTimeInMilliseconds = 10_000
): Promise<Message[]> => {
  const result: Message[] = [];

  for (const prompt of prompts) {
    await channel.send(prompt);

    const input = await channel.awaitMessages({
      filter: messageFilter,
      max: 1,
      time: promptTimeInMilliseconds,
      errors: ['time'],
    });

    const message = input.first();

    if (!message) {
      continue;
    }

    result.push(message);
  }

  return result;
};

export const rotation: DiscordCommand = {
  name: 'rotation',
  description: 'Creates a channel rotation',
  handler: async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    if (!interaction.channel) {
      return;
    }

    const isAllowed = await discordUserService.isAllowed(interaction.user.id);

    const isAuthorized =
      interaction.guild?.ownerId === interaction.user.id || isAllowed;

    if (!isAuthorized) {
      await interaction?.reply({
        content: `You re not a guild owner or an allowed member to perform this action`,
        ephemeral: true,
      });
      return;
    }

    const channels = await discordChannelService.getChannels();

    if (channels.includes(interaction.channelId)) {
      await interaction?.reply({
        content: 'Channel already has a rotation',
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(
      `Bip bup... creating your rotation. Please answer a few questions:`
    );

    const filter = (message: Message) => {
      return message.author.id === interaction.user.id;
    };

    try {
      const [participants, length, startDate] = await getPromptsAnswers(
        interaction.channel,
        [
          'Tag rotation participants',
          'Write rotation length as **<number> days**',
          'Write start date in YYYY-MM-DD',
        ],
        filter,
        60_000
      );

      await isValidParticipantsAnswer(participants);

      const participantsIds = await getUsersFromMessage(participants);

      await discordChannelService.findOrCreateChannelRotation(
        interaction.channelId,
        interaction.guild?.channels.cache.find(
          (channel) => channel.id === interaction.channelId
        )?.name as string,
        participantsIds,
        startDate?.content,
        length?.content
      );

      await interaction.channel.send(`Channel Rotation created succesfully`);
    } catch (error) {
      if (error instanceof ServerError) {
        await interaction.channel?.send(
          `Error: ${error.message}. Please start over`
        );
        return;
      }

      await interaction.channel?.send(
        `Something went wrong with creation, Please start over.`
      );
    }
  },
};
