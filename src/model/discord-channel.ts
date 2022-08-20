import { getModelForClass, prop } from '@typegoose/typegoose';

import { MongoBase } from './base';

export class DiscordChannelRotation extends MongoBase {
  @prop()
  channelId!: string;

  @prop()
  rotationId!: string;
}

export const DiscordChannelRotationModel = getModelForClass(
  DiscordChannelRotation
);

export type DiscordChannelRotationData = Omit<
  DiscordChannelRotation,
  keyof MongoBase
>;
