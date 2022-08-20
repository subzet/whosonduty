import { Interaction } from 'discord.js';

export interface DiscordCommand {
  name: string;
  description: string;
  handler: (interaction: Interaction) => Promise<void>;
}
