import {
  DiscordChannelRotation,
  DiscordChannelRotationData,
} from '../../model';

export interface IDiscordChannelRepository {
  findByChannelId: (
    channelId: string
  ) => Promise<DiscordChannelRotation | undefined>;
  create: (data: DiscordChannelRotationData) => Promise<DiscordChannelRotation>;
  findAll: () => Promise<DiscordChannelRotation[]>;
}
