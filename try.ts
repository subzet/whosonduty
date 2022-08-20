/* eslint-disable unicorn/no-process-exit */
import { RotationData } from './src/model';
import { rotationService } from './src/service';

async function main() {
  const data: RotationData = {
    name: 'Support',
    length: '5 days',
    responsible: ['1', '2', '3'],
  };

  const rotation = await rotationService.create(data);

  console.log(rotation);
}

void main()
  .catch((error) => console.error(error))
  .then(() => process.exit());
