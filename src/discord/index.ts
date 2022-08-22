import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

import { environment } from '../util';
import { allowedUser, ping, rotation } from './command';
import {
  incidentThreadSolutionMessageHandler,
  rotationChannelSupportMessageHandler,
} from './message';

const commands = [ping, rotation, allowedUser];

const messageHandler = [
  rotationChannelSupportMessageHandler,
  incidentThreadSolutionMessageHandler,
];

const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(environment.DISCORD_CLIENT_ID), {
      body: commands.map((command) => {
        return {
          name: command.name,
          description: command.description,
        };
      }),
    });

    console.log(
      `Succesfully registered commands`,
      commands.map((command) => command.name)
    );
  } catch (error) {
    console.error(error);
  }
})();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commands.find(
    (command) => command.name === interaction.commandName
  );

  if (command) {
    await command.handler(interaction);
  }
});

client.on('messageCreate', async (message) => {
  await Promise.all(messageHandler.map((handler) => handler(message)));
});

client.login(environment.DISCORD_TOKEN);
