import S from './index'
import _ from 'lodash'

const mockList = [
  { oldId: 1 }, { oldId: 2 }
]

const mockNewPropertyList = [
  { newId: 11 }, { newId: 22 }
]

const promiseList = function () {
  return new Promise((resolve) => {
    _.delay(() => {
      resolve(mockList)
    }, 1000)
  })
}

const promiseNewPropertyList = function () {
  return new Promise((resolve) => {
    _.delay(() => {
      resolve(mockNewPropertyList)
    }, 1000)
  })
}

const promiseCount = function () {
  return new Promise((resolve) => {
    _.delay(() => {
      resolve(mockList.length)
    }, 1000)
  })
}

const getList = function (context) {
  return promiseList().then(list => {
    context.list = list
  })
}

const getNewPropertyList = function (context) {
  return promiseNewPropertyList().then(newPropertyList => {
    _.map(context.list, (item, i) => {
      item.newId = newPropertyList[i].newId
    })
  })
}

const getCount = function (context) {
  return promiseCount().then(count => {
    context.count = count
  })
}

// 支持如下配置方式
const sequenceConfig = [
  {
    promise: getList,
    thenRun: [
      getNewPropertyList,
    ],
  },
  getCount,
]

const otherConfig = [
  {
    promise: promiseList(),
    thenRun: [
      promiseNewPropertyList(),
    ]
  },
  promiseCount(),
  1 === 2 ? promiseCount() : null,
]

const expectResult = {
  list: [
    {
      oldId: 1,
      newId: 11,
    },
    {
      oldId: 2,
      newId: 22,
    }
  ],
  count: 2
}

const getTime = function () {
  return new Date().getTime()
}

let startTime = 0, endTime = 0
it('Test the running results of the sequence', async () => {
  startTime = getTime()
  await expect(S.allSettled(sequenceConfig, {})).resolves.toMatchObject(expectResult)
  endTime = getTime()
})

it('Test the sequence running time',  () => {
  if (startTime === 0) {
    return
  }
  const runTime = endTime - startTime
  expect(runTime).toBeGreaterThan(2000)
  expect(runTime).toBeLessThan(2100)
})

it('Other configured test sequence run results', async () => {
  await expect(S.allSettled(otherConfig, {})).resolves.toMatchObject({})
})