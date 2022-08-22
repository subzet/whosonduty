import { getModelForClass, prop } from '@typegoose/typegoose';

import { MongoBase } from './base';

export class IncidentThread extends MongoBase {
  @prop()
  channelId!: string;

  @prop()
  threadId!: string;

  @prop()
  solved!: boolean;

  @prop()
  ownerId!: string;

  @prop()
  solvedBy?: string;
}

export const IncidentThreadModel = getModelForClass(IncidentThread);

export type IncidentThreadData = Omit<IncidentThread, keyof MongoBase>;
