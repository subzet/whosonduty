import { RotationData } from '../model';
import { mongoRotationRepository } from '../repository';
import { Errors } from '../util';

class RotationService {
  private isValidRotation = (data: RotationData) => {
    const lengthRegex = /\d* days/;

    if (lengthRegex.test(data.length)) {
      throw Errors.invalidOperation(
        'Invalid rotation length. Try `<number> days`'
      );
    }
  };

  public create(data: RotationData): Promise<RotationData> {
    this.isValidRotation(data);

    return mongoRotationRepository.create(data);
  }
}

export const rotationService = new RotationService();
