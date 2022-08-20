import dayjs from 'dayjs';

import { Rotation, RotationData, RotationModel } from '../../model';
import { Errors } from '../../util';
import { IRotationRepository } from './types';

export class MongoRotationRepository implements IRotationRepository {
  public findById = async (id: string): Promise<Rotation> => {
    const rotation = await RotationModel.findById(id);

    if (!rotation) {
      throw Errors.invalidOperation();
    }

    return rotation.toObject();
  };

  public create = async (data: RotationData): Promise<Rotation> => {
    const rotation = await RotationModel.create(data);

    return rotation.toObject();
  };

  public delete = async (id: string): Promise<boolean> => {
    await RotationModel.updateOne({ _id: id }, { deletedAt: dayjs().toDate() });

    return true;
  };

  public update = async (id: string, data: RotationData): Promise<Rotation> => {
    await RotationModel.updateOne({ _id: id }, data);

    return this.findById(id);
  };
}

export const mongoRotationRepository = new MongoRotationRepository();
