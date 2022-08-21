import { mongoUserRepository } from '../repository';

export class DiscordUserService {
  public isAllowed = async (userId: string) => {
    const user = await mongoUserRepository.findById(userId);

    return !!user;
  };

  public createUser = async (userId: string) => {
    await mongoUserRepository.findOrCreate({
      userId,
    });
  };
}

export const discordUserService = new DiscordUserService();
