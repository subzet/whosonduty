import { Interaction, Message, TextBasedChannel } from 'discord.js';

import { discordUserService } from '../../service';
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

    console.log(`MESSAGE`, message);

    if (!message) {
      continue;
    }

    result.push(message);
  }

  return result;
};

export const allowedUser: DiscordCommand = {
  name: 'allowed-user',
  description: 'Sets allowed users to create rotation',
  handler: async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    if (!interaction.channel) {
      return;
    }

    if (interaction.guild?.ownerId !== interaction.user.id) {
      await interaction?.reply({
        content: `You re not a guild owner or an allowed member to perform this action`,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(
      `Great! Let's update who is allowed to create rotations`
    );

    const filter = (message: Message) => {
      return message.author.id === interaction.user.id;
    };

    try {
      const [users] = await getPromptsAnswers(
        interaction.channel,
        ['Tag users allowed to create rotations'],
        filter,
        60_000
      );

      isValidParticipantsAnswer(users);

      const usersIds = getUsersFromMessage(users);

      await Promise.all(
        usersIds.map((userId) => discordUserService.createUser(userId))
      );

      await interaction.channel?.send(`Users allowed updated!`);
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
