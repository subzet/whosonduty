import { DiscordChannelRotation } from '../model';
import { mongoDiscordChannelRepository } from '../repository/discord-channel';
import { rotationService } from './rotation';

class DiscordChannelService {
  public getChannels = async () => {
    //TODO: Make this method cache base to avoid calling mongo everytime we need to get
    //channels involed.
    const channels = await mongoDiscordChannelRepository.findAll();

    return channels.map((channel) => channel.channelId);
  };

  public findByChannelId = async (
    channelId: string
  ): Promise<DiscordChannelRotation | undefined> => {
    return mongoDiscordChannelRepository.findByChannelId(channelId);
  };

  public findOrCreateChannelRotation = async (
    channelId: string,
    name: string,
    responsible: string[],
    ownerId: string,
    startDate?: string,
    length = '7 days'
  ) => {
    const channelRotation = await mongoDiscordChannelRepository.findByChannelId(
      channelId
    );

    if (channelRotation) {
      return rotationService.findById(channelRotation.rotationId);
    }

    const rotation = await rotationService.create(
      {
        name,
        length,
        responsible,
        ownerId,
      },
      startDate
    );

    await mongoDiscordChannelRepository.create({
      channelId,
      rotationId: rotation._id.toString(),
    });

    return rotation;
  };

  public getResponsible = async (channelId: string) => {
    const channelRotation = await mongoDiscordChannelRepository.findByChannelId(
      channelId
    );

    if (!channelRotation) {
      return;
    }

    await rotationService.rotate(channelRotation?.rotationId);

    const rotation = await rotationService.findById(
      channelRotation?.rotationId
    );

    return rotation.duty?.[0].userId;
  };

  public getRotation = async (channelId: string) => {
    const channelRotation = await mongoDiscordChannelRepository.findByChannelId(
      channelId
    );

    if (!channelRotation) {
      return;
    }

    await rotationService.rotate(channelRotation?.rotationId);

    return await rotationService.findById(channelRotation?.rotationId);
  };
}

export const discordChannelService = new DiscordChannelService();
