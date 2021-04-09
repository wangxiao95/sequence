type Result = unknown

type PromiseFunction<T> = (result: T) => Promise<unknown> | undefined

interface PromiseItem<T> {
    promise: PromiseFunction<T> | Promise<unknown> | null
    then?: Item<T>[]
}

type Item<T> = PromiseItem<T> | Promise<unknown> | PromiseFunction<T> | null

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
 *     then: [
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
async function allSettled<T = Result>(config: Item<T>[], result: T): Promise<T> {
    const requestList = config.map(item => {
        if (!item) {
            return
        }
        // get(url)
        if (item instanceof Promise) {
            return item
        }
        if (typeof item === 'function') {
            // (context) => get(url, {id: context.id})
            return item(result)
        } else {
            // [
            //  { promise: (context) => get(url, {id: context.id}) },
            //  { promise: get(url) },
            // ]
            const promise = item.promise
            if (typeof promise === 'function') {
                return promise(result)
            } else {
                return promise
            }
        }
    })

    await Promise.allSettled(requestList)

    for (let i = 0; i < config.length; i++) {
        const then = (config[i] as PromiseItem<T>)?.then
        if (then) {
            await allSettled(then, result)
        }
    }
    return result
}

export default {
    allSettled,
}
