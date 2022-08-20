import { isNil, isObject, omit } from 'lodash';
import mongoose from 'mongoose';

import { environment, setupDatabase, uuid } from '../src/util';

export type Fixture = {
  name: string;
  seed: () => Promise<void>;
};

export async function initDisposableDatabase(drop = true) {
  const id = uuid().replace(/[_-]/g, '').toLowerCase();

  try {
    console.log(`Created database local_test_${id}`);

    environment.MONGO_DATABASE_URL = `mongodb://mongouser:mongopass@localhost:27017/local_test_${id}?authSource=admin`;

    await setupDatabase();
  } catch (error) {
    console.error('initDisposableDatabase failed', error);

    throw error;
  }

  return async () => {
    if (drop) {
      await mongoose.connection.dropDatabase();
    }

    await mongoose.disconnect();
  };
}

export function omitDeep(input: any, properties: any) {
  function omitDeepOnOwnProperties(object: any): any {
    if (typeof input === 'undefined') {
      return input;
    }

    if (!Array.isArray(object) && !isObject(object)) {
      return object;
    }

    if (Array.isArray(object)) {
      return omitDeep(object, properties);
    }

    const o = {} as any;
    for (const [key, value] of Object.entries(object)) {
      o[key] = !isNil(value) ? omitDeep(value, properties) : value;
    }

    return omit(o, properties) as any;
  }

  if (arguments.length > 2) {
    // eslint-disable-next-line prefer-rest-params
    properties = Array.prototype.slice.call(arguments).slice(1);
  }

  if (Array.isArray(input)) {
    return input.map((element: any) => omitDeepOnOwnProperties(element));
  }

  return omitDeepOnOwnProperties(input) as any;
}

export const omitColumns = (data: any, columns: string[] = []) => {
  return omitDeep(data, [
    '_id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    ...columns,
  ]);
};
