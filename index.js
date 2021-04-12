(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.sequence = factory());
}(this, (function () { 'use strict';

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
    async function allSettled(config, result) {
        const requestList = config.map(item => {
            if (!item) {
                return;
            }
            // get(url)
            if (item instanceof Promise) {
                return item;
            }
            if (typeof item === 'function') {
                // (context) => get(url, {id: context.id})
                return item(result);
            }
            else {
                // [
                //  { promise: (context) => get(url, {id: context.id}) },
                //  { promise: get(url) },
                // ]
                const promise = item.promise;
                if (typeof promise === 'function') {
                    return promise(result);
                }
                else {
                    return promise;
                }
            }
        });
        await Promise.allSettled(requestList);
        for (let i = 0; i < config.length; i++) {
            const thenRun = config[i]?.thenRun;
            if (thenRun) {
                await allSettled(thenRun, result);
            }
        }
        return result;
    }
    var index = {
        allSettled,
    };

    return index;

})));
