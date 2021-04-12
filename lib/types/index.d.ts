declare type Result = unknown;
declare type PromiseFunction<T> = (result: T) => Promise<unknown> | undefined;
interface PromiseItem<T> {
    promise: PromiseFunction<T> | Promise<unknown> | null;
    thenRun?: Item<T>[];
}
declare type Item<T> = PromiseItem<T> | Promise<unknown> | PromiseFunction<T> | null;
/**
 * 增强版allSettled，支持存在父子依赖关系的并发
 *
 * 图例：
 *                   -- promiseA1
 *   -- promiseA --｜
 * ｜                -- promiseA2
 *   -- promiseB
 *
 * @example
 *
 * import superQ from 'common/utils/superQ'
 *
 * function getList(result) {
 *  return post(url).then(({ data }) => {
 *    // 往结果中追加数据
 *    result.list = data
 *   }, ({ message }) => {
 *    // 截断执行
 *     throw new Error(message)
 *   })
 * }
 *
 * function getCount(result) {
 *  return post(url).then(({ data }) => {
 *    // 往结果中追加数据
 *    result.count = data
 *   }, ({ message }) => {
 *    console.error(message)
 *   })
 * }
 *
 * const config = [
 *   {
 *     promise: getList,
 *     // 子promise
 *     thenRun: [
 *       getStaff,
 *       getTags,
 *     ]
 *   }
 *   getCount,
 * ]
 *
 * try {
 *   const result = await superQ.allSettled(config, {})
 * } catch({ message }) {
 *   this.$message({ type: 'danger', message })
 * }
 * @param config
 * @param result
 */
declare function allSettled<T = Result>(config: Item<T>[], result: T): Promise<T>;
declare const _default: {
    allSettled: typeof allSettled;
};
export default _default;
