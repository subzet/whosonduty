import { Interaction, Message } from 'discord.js';

import { discordChannelService } from '../../service/discord-channel';
import { Errors } from '../../util';
import { DiscordCommand } from '../types';

const awaitInput = (interaction: Interaction) => {
  const filter = (message: Message) => {
    return message.author.id === interaction.user.id;
  };

  return interaction.channel?.awaitMessages({
    filter,
    max: 1,
    time: 10_000,
    errors: ['time'],
  });
};

const isValidParticipantsAnswer = (message: Message) => {
  if (message.mentions.users.size === 0) {
    throw Errors.invalidOperation(`No mentions in message`);
  }
};

const getParticipantsFromMessage = (message: Message) => {
  return message.mentions.users.map((user) => user.id);
};

export const rotation: DiscordCommand = {
  name: 'rotation',
  description: 'Creates a channel rotation',
  handler: async (interaction: Interaction) => {
    if (!interaction.isCommand()) {
      return;
    }

    try {
      await interaction.reply({ content: `Insert rotation participants` });

      const partipants = await awaitInput(interaction);

      const participantsAnswer = partipants?.first();

      if (!participantsAnswer) {
        throw Errors.invalidOperation();
      }

      isValidParticipantsAnswer(participantsAnswer);

      const participantsIds = getParticipantsFromMessage(participantsAnswer);

      await participantsAnswer?.reply({ content: `Insert rotation length` });

      const length = await awaitInput(interaction);

      const lengthAnswer = length?.first();

      const rotation = await discordChannelService.findOrCreateChannelRotation(
        interaction.channelId,
        'fake name',
        participantsIds
      );

      await interaction.channel?.send(
        `Finished creating rotation: ${JSON.stringify(rotation)}`
      );
    } catch {
      await interaction.channel?.send(
        `Did not receive any valid response, start over`
      );
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
