import {
  DiscordChannelRotation,
  DiscordChannelRotationData,
  DiscordChannelRotationModel,
} from '../../model';
import { IDiscordChannelRepository } from './types';

export class MongoDiscordChannelRepository
  implements IDiscordChannelRepository
{
  public findByChannelId = async (
    channelId: string
  ): Promise<DiscordChannelRotation | undefined> => {
    const discordChannel = await DiscordChannelRotationModel.findOne({
      channelId,
    });

    if (!discordChannel) {
      return;
    }

    return discordChannel.toObject();
  };

  public create = async (
    data: DiscordChannelRotationData
  ): Promise<DiscordChannelRotation> => {
    return DiscordChannelRotationModel.create(data);
  };

  public findAll = async (): Promise<DiscordChannelRotation[]> => {
    return DiscordChannelRotationModel.find({
      deletedAt: {
        $exists: false,
      },
    });
  };
}

export const mongoDiscordChannelRepository =
  new MongoDiscordChannelRepository();
