import {Knex} from 'knex';

/**
 * insert a record if not exist
 * @param knex Knex
 * @param tablename tableName
 * @param data data to insert
 * @param where fields to match record
 * @param key select key
 */
export const insertIfNotExist = async <T>(knex: Knex, tablename: string, data: Partial<T>, where: Partial<T>, key?: string): Promise<number> => {
    const found = await knex(tablename).select(key || '*').where(where);
    if (found.length === 0) {
        const [result] = await knex(tablename).insert(data);
        return result;
    }
    return 0;
};

/**
 * update or insert a record
 * @param knex Knex
 * @param tablename tableName
 * @param data data to insert
 * @param where fields to match record
 * @param key select key
 */
export const upsert = async <T>(knex: Knex, tablename: string, data: Partial<T>, where: Partial<T>, key?: string): Promise<number> => {
    const found = await knex(tablename).select(key || '*').where(where);
    if (found.length === 0) {
        await knex(tablename).insert(data);
    } else {
        await knex(tablename).update(data).where(where);
    }
    return found[0]?.id || 0;
};

/**
 * get a record by id
 * @param knex Knex
 * @param tablename tableName
 * @param id id
 */
export const getById = async <T>(knex: Knex, tablename: string, id: number | string): Promise<T> => {
    const [result] = await knex(tablename).where('id', id).limit(1);
    return result as T;
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
