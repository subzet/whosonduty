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
  name!: string; // Backend Support;

  @prop()
  length!: string; // 7 days;

  @prop()
  responsible!: string[]; // [Manu, Ari, Marcos]

  @prop()
  duty?: RotationDuty[];
  // [Last RotationDuty, Current Rotation Duty , Next RotationDuty] o [Current Rotation Duty, Next Rotation Duty]
}

export const RotationModel = getModelForClass(Rotation);

export type RotationData = Omit<Rotation, keyof MongoBase>;
