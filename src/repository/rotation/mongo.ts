import { Rotation, RotationData } from '../../model';
import { IRotationRepository } from './types';

export class MongoRotationRepository implements IRotationRepository {
  create: (data: RotationData) => Promise<Rotation>;
  delete: (id: string) => Promise<boolean>;
  update: (id: string, data: RotationData) => Promise<Rotation>;
}

export const mongoRotationRepository = new MongoRotationRepository();
