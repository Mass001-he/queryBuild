import { QueryBuilder } from './query'
import { insertUnit } from './sqlBuilder/units/insert'

export * from './query'
export * from './types/query.type'
export * from './utils'

console.log(
  insertUnit([
    {
      rule: {
        table: 'users',
        values: [
          { name: 'John', age: 25, role: 'admin' },
          { name: 'Jane', age: 23 },
        ],
      },
    },
  ]),
)

new QueryBuilder().insert('users', ['name', 1111])
