import { Rotation, RotationData } from '../../model';

export interface IRotationRepository {
  create: (data: RotationData) => Promise<Rotation>;
  delete: (id: string) => Promise<boolean>;
  update: (data: RotationData) => Promise<Rotation>;
}
