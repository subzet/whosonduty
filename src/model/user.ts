import { getModelForClass, prop } from '@typegoose/typegoose';

import { MongoBase } from './base';

export class DiscordUser extends MongoBase {
  @prop()
  userId!: string;
}

export const DiscordUserModel = getModelForClass(DiscordUser);

export type DiscordUserData = Omit<DiscordUser, keyof MongoBase>;
