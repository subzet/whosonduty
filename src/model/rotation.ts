import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { MongoBase } from './base';

@modelOptions({
  schemaOptions: { _id: false },
})
export class RotationDuty {
  @prop()
  userId!: string; //Points to user on duty
  @prop()
  startDate!: Date; //Start of rotation
  @prop()
  endDate!: Date; //End of rotation
}

export class Rotation extends MongoBase {
  @prop()
  name!: string;

  @prop()
  length!: string;

  @prop()
  responsible!: string[];

  @prop()
  duty?: RotationDuty[];

  @prop()
  ownerId!: string;
}

export const RotationModel = getModelForClass(Rotation);

export type RotationData = Omit<Rotation, keyof MongoBase>;
