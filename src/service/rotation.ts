import dayjs, { Dayjs } from 'dayjs';
import ms from 'ms';

import { Rotation, RotationData, RotationDuty } from '../model';
import { mongoRotationRepository } from '../repository';
import { Errors } from '../util';

class RotationService {
  private isValidRotation = (data: RotationData) => {
    const lengthRegex = /\d* days/;

    if (!lengthRegex.test(data.length)) {
      throw Errors.invalidOperation(
        'Invalid rotation length. Try `<number> days`'
      );
    }

    if (data.responsible.length === 0) {
      throw Errors.invalidOperation(
        'Responsible list should have at least one responsible'
      );
    }
  };

  private isValidStartDate = (date: string, length: string) => {
    const isValidDate = dayjs(date).isValid();

    if (!isValidDate) {
      throw Errors.invalidOperation('Invalid date. Start date is incorrect');
    }

    const isValidStartDate = dayjs()
      .subtract(ms(length), 'millisecond')
      .isBefore(date);

    if (!isValidStartDate) {
      throw Errors.invalidOperation(
        'Invalid date. Start date should be after current date minus rotation length'
      );
    }
  };

  private getPeriodDates = (date: string, length: string): Dayjs[] => {
    return [dayjs(date), dayjs(date).add(ms(length), 'millisecond')];
  };

  private isNextPeriod(startDate: string): boolean {
    return dayjs().isBefore(startDate);
  }

  private generateRotationDuty = (
    data: RotationData,
    startDate: string,
    responsibleIndex = 0
  ) => {
    const result: RotationDuty[] = [];

    const [rotationDutyStartDate, rotationDutyEndDate] = this.getPeriodDates(
      startDate,
      data.length
    );

    let rotationDuty: RotationDuty = {
      startDate: rotationDutyStartDate.toDate(),
      endDate: rotationDutyEndDate.toDate(),
      userId: data.responsible[responsibleIndex],
    };

    result.push({ ...rotationDuty });

    while (!this.isNextPeriod(dayjs(rotationDuty.startDate).toISOString())) {
      const [rotationDutyStartDate, rotationDutyEndDate] = this.getPeriodDates(
        dayjs(rotationDuty.endDate).toISOString(),
        data.length
      );

      const currentResponsibleIndex = data.responsible.indexOf(
        rotationDuty.userId
      );

      const hasNextResponsible =
        currentResponsibleIndex + 1 < data.responsible.length;

      rotationDuty = {
        startDate: rotationDutyStartDate.toDate(),
        endDate: rotationDutyEndDate.toDate(),
        userId: hasNextResponsible
          ? data.responsible[currentResponsibleIndex + 1]
          : data.responsible[0],
      };

      result.push({ ...rotationDuty });
    }

    return result;
  };

  public create(
    data: RotationData,
    startDate = dayjs().startOf('day').toISOString()
  ): Promise<Rotation> {
    this.isValidRotation(data);

    this.isValidStartDate(startDate, data.length);

    const duty = this.generateRotationDuty(data, startDate);

    return mongoRotationRepository.create({ ...data, duty });
  }

  private shouldRotate = (rotation: Rotation) => {
    return dayjs().isAfter(rotation.duty?.[0].endDate);
  };

  public async rotate(rotationId: string) {
    const rotation = await mongoRotationRepository.findById(rotationId);

    if (!rotation.duty?.[0]) {
      throw Errors.invalidOperation('Rotation is invalid, no duties assigned');
    }

    if (!this.shouldRotate(rotation)) {
      throw Errors.invalidOperation(
        'Rotation can not be rotated because current rotation has not finished yet.'
      );
    }

    const currentRotationDuty = rotation.duty?.[0];

    const currentResponsibleIndex = rotation.responsible.indexOf(
      currentRotationDuty.userId
    );

    const hasNextResponsible =
      currentResponsibleIndex + 1 < rotation.responsible.length;

    const duty = hasNextResponsible
      ? this.generateRotationDuty(
          rotation,
          dayjs(currentRotationDuty.endDate).toISOString(),
          currentResponsibleIndex + 1
        )
      : this.generateRotationDuty(
          rotation,
          dayjs(currentRotationDuty.endDate).toISOString()
        );

    await mongoRotationRepository.update(rotationId, { ...rotation, duty });
  }

  public findById = async (rotationId: string) => {
    return mongoRotationRepository.findById(rotationId);
  };
}

export const rotationService = new RotationService();
