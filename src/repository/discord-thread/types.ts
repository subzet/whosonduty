import { IncidentThread, IncidentThreadData } from '../../model';

export interface IIncidentThreadRepository {
  create(data: IncidentThreadData): Promise<IncidentThread>;
  findByThreadId(threadId: string): Promise<IncidentThread | void>;
  findAllByChannelId(channelId: string): Promise<IncidentThread[]>;
  solveThread(threadId: string, responsibleId: string): Promise<void>;
  getThreadCount(channelId: string): Promise<number>;
}
