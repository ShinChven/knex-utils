/**
 * insert a record if not exist
 * @param knex Knex
 * @param tablename tableName
 * @param data data to insert
 * @param where fields to match record
 * @param key select key
 */
import {Knex} from 'knex';

export const insertIfNotExist = async <T>(knex: Knex, tablename: string, data: Partial<T>, where: Partial<T>, key?: string): Promise<number> => {
  const found = await knex<T>(tablename).select(key || '*').where(where);
  if (found.length === 0) {
    const [result] = await knex(tablename).insert(data);
    return result;
  }
  return 0;
};

export type UpsertAndReturnProps<T> = {
  tableName: string;
  data: Partial<T>;
  where: Partial<T>;
  returnRecord?: boolean;
  knex: Knex;
}

export const upsert
  = async <T>({tableName, where, data, returnRecord, knex}: UpsertAndReturnProps<T>): Promise<T | void> => {

  const existed = await knex<T>(tableName).select('id').where(where).first() as { id: number };
  let id: number;
  if (existed && existed.id) {
    console.log('existed');
    await knex<T>(tableName).update(data).where({id: existed.id});
    id = existed.id;
  } else {
    console.log('not existed');
    const [created] = await knex<T>(tableName).insert(data);
    id = created;
  }

  if (returnRecord === true) {
    return knex(tableName).select('*').where({id}).first() as T;
  }

  return Promise.resolve();
};

/**
 * Get a record by id
 * @param knex Knex
 * @param tablename tableName
 * @param id id
 */
export const getById = async <T>(knex: Knex, tablename: string, id: number | string): Promise<T> => {
  return await knex(tablename).where('id', id).first() as T;
};

/**
 * insert a record and return it
 * @param knex Knex
 * @param tablename tableName
 * @param data data
 */
export const insertAndReturn = async <T>(knex: Knex, tablename: string, data: Partial<T>): Promise<T> => {
  const [id] = await knex(tablename).insert(data);
  return getById<T>(knex, tablename, id);
};
