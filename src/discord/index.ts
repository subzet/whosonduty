import {
  Client,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
} from 'discord.js';

import { environment } from '../util';
import { greet, ping, truth } from './controller';

export interface DiscordCommand {
  name: string;
  description: string;
  handler: (interaction: Interaction) => Promise<void>;
}

const commands = [ping, greet, truth];

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

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  console.log(interaction);

  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(
    (command) => command.name === interaction.commandName
  );

  if (command) {
    await command.handler(interaction);
  }
});

client.login(environment.DISCORD_TOKEN);
