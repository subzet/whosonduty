import dayjs from 'dayjs';
import ms from 'ms';

import { RotationData, RotationModel } from '../../src/model';
import { rotationService } from '../../src/service/rotation';
import { initDisposableDatabase } from '../helper';

let database: () => void;

async function createMockRotation(
  participants: number,
  firstDutyStartDate: string,
  currentIndex = 0,
  nextIndex = 1
) {
  // eslint-disable-next-line unicorn/no-new-array, unicorn/new-for-builtins
  const responsible = [...Array(participants)].map((_, index) =>
    String(index + 1)
  );

  const length = '5 days';

  return RotationModel.create({
    name: 'Fake',
    responsible,
    length,
    duty: [
      {
        userId: responsible[currentIndex],
        startDate: dayjs(firstDutyStartDate).toDate(),
        endDate: dayjs(firstDutyStartDate)
          .add(ms(length), 'millisecond')
          .toDate(),
      },
      {
        userId: responsible[nextIndex],
        startDate: dayjs(firstDutyStartDate)
          .add(ms(length), 'millisecond')
          .toDate(),
        endDate: dayjs(firstDutyStartDate)
          .add(ms(length) * 2, 'millisecond')
          .toDate(),
      },
    ],
  });
}

describe('Rotation test', () => {
  beforeAll(async () => {
    database = await initDisposableDatabase();
  });

  afterAll(async () => {
    database();
  });

  it('Should create rotation with participants', async () => {
    const data: RotationData = {
      name: 'Support',
      length: '5 days',
      responsible: ['1', '2', '3'],
    };

    const rotation = await rotationService.create(data);

    expect(rotation).toMatchSnapshot();
  });

  it('Should rotate participants', async () => {
    const mockRotation = await createMockRotation(
      3,
      dayjs().subtract(6, 'day').toISOString()
    );

    await rotationService.rotate(mockRotation._id.toString());

    const rotation = await rotationService.findById(
      mockRotation._id.toString()
    );

    expect(mockRotation).toMatchSnapshot();
    expect(rotation).toMatchSnapshot();
    expect(mockRotation.duty?.[1].userId).toBe(rotation.duty?.[0].userId);
  });

  it('Should rotate participants and begin again', async () => {
    const mockRotation = await createMockRotation(
      3,
      dayjs().subtract(6, 'day').toISOString(),
      2,
      0
    );

    await rotationService.rotate(mockRotation._id.toString());

    const rotation = await rotationService.findById(
      mockRotation._id.toString()
    );

    expect(mockRotation).toMatchSnapshot();
    expect(rotation).toMatchSnapshot();
    expect(mockRotation.duty?.[1].userId).toBe(rotation.duty?.[0].userId);
  });
});
