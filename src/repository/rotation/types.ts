import { Rotation, RotationData } from '../../model';

export interface IRotationRepository {
  findById: (id: string) => Promise<Rotation>;
  create: (data: RotationData) => Promise<Rotation>;
  delete: (id: string) => Promise<boolean>;
  update: (id: string, data: RotationData) => Promise<Rotation>;
}
