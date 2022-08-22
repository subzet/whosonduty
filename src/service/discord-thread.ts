import { IncidentThread } from '../model';
import { mongoIncidentThreadRepository } from '../repository';
import { Errors } from '../util';
import { discordChannelService } from './discord-channel';
import { rotationService } from './rotation';

export class DiscordThreadService {
  public async createThread(
    channelId: string,
    threadId: string,
    ownerId: string
  ): Promise<IncidentThread> {
    const thread = await mongoIncidentThreadRepository.findByThreadId(threadId);

    if (thread) {
      return thread;
    }

    return mongoIncidentThreadRepository.create({
      threadId,
      channelId,
      ownerId,
      solved: false,
    });
  }

  public async findUnsolvedThread(
    threadId: string
  ): Promise<IncidentThread | undefined> {
    const thread = await mongoIncidentThreadRepository.findByThreadId(threadId);

    if (!thread || thread.solved) {
      return;
    }

    return thread;
  }

  public async solveThread(
    threadId: string,
    channelId: string,
    responsibleId: string
  ) {
    const thread = await mongoIncidentThreadRepository.findByThreadId(threadId);

    if (!thread || thread.solved) {
      throw Errors.invalidOperation(
        'Thread does not exists or is already solved'
      );
    }

    const channelRotation = await discordChannelService.findByChannelId(
      channelId
    );

    if (!channelRotation) {
      throw Errors.invalidOperation('Thread does not belong to a rotation');
    }

    const rotation = await rotationService.findById(channelRotation.rotationId);

    const isValid =
      rotation &&
      (rotation.responsible.includes(responsibleId) ||
        responsibleId === thread.ownerId);

    if (!isValid) {
      throw Errors.invalidOperation(
        'You are not part of this rotation to solve this thread'
      );
    }

    await mongoIncidentThreadRepository.solveThread(
      threadId,
      rotation.responsible.includes(responsibleId) ? responsibleId : undefined
    );
  }

  public getThreadCount = async (channelId: string): Promise<number> => {
    return mongoIncidentThreadRepository.getThreadCount(channelId);
  };
}

export const discordThreadService = new DiscordThreadService();
