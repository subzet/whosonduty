import { DiscordUser, DiscordUserData } from '../../model';

export interface IDiscordUserRepository {
  findOrCreate: (data: DiscordUserData) => Promise<DiscordUser>;
  findById: (id: string) => Promise<DiscordUser | void>;
}
