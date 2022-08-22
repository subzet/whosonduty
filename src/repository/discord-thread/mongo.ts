import {
  IncidentThread,
  IncidentThreadData,
  IncidentThreadModel,
} from '../../model';
import { IIncidentThreadRepository } from './types';

export class MongoIncidentThreadRepository
  implements IIncidentThreadRepository
{
  public create = async (data: IncidentThreadData): Promise<IncidentThread> => {
    return IncidentThreadModel.create(data);
  };

  public findByThreadId = async (
    threadId: string
  ): Promise<IncidentThread | void> => {
    const thread = await IncidentThreadModel.findOne({ threadId });

    if (!thread) {
      return;
    }

    return thread.toObject();
  };

  public findAllByChannelId = async (
    channelId: string
  ): Promise<IncidentThread[]> => {
    return IncidentThreadModel.find({ channelId });
  };

  public solveThread = async (
    threadId: string,
    responsibleId?: string
  ): Promise<void> => {
    const thread = await this.findByThreadId(threadId);

    if (!thread || thread.solved) {
      return;
    }

    await IncidentThreadModel.findByIdAndUpdate(thread._id, {
      ...thread,
      solved: true,
      solvedBy: responsibleId,
    });
  };

  public getThreadCount = async (channelId: string): Promise<number> => {
    return IncidentThreadModel.count({ channelId });
  };
}

export const mongoIncidentThreadRepository =
  new MongoIncidentThreadRepository();
