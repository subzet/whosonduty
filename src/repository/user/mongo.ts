import { DiscordUser, DiscordUserData, DiscordUserModel } from '../../model';
import { IDiscordUserRepository } from './types';

export class MongoUserRepository implements IDiscordUserRepository {
  private create = async (data: DiscordUserData): Promise<DiscordUser> => {
    const user = await DiscordUserModel.create({ ...data });

    return user.toObject();
  };

  public findOrCreate = async (data: DiscordUserData): Promise<DiscordUser> => {
    const user = await this.findById(data.userId);

    if (!user) {
      return this.create(data);
    }

    return user;
  };

  public findById = async (id: string): Promise<DiscordUser | void> => {
    const user = await DiscordUserModel.findOne({ userId: id });

    if (!user) {
      return;
    }

    return user.toObject();
  };
}

export const mongoUserRepository = new MongoUserRepository();
