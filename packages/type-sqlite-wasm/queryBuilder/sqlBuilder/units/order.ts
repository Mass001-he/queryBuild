import type {
  Bindings,
  OrderByClause,
  SQLWithBindings,
} from '../../types/query.type'
import { quotes, validateBindings } from '../../utils'

function validateOrderDirection(direction?: string) {
  if (!direction) {
    return
  }

  if (direction !== 'ASC' && direction !== 'DESC') {
    throw new Error('Invalid order direction')
  }
}

function validateNulls(nulls?: string) {
  if (!nulls) {
    return
  }

  if (nulls !== 'FIRST' && nulls !== 'LAST') {
    throw new Error('Invalid nulls value')
  }
}

export const orderUnit = (
  orderByClauses?: OrderByClause[],
): SQLWithBindings => {
  if (orderByClauses === undefined || orderByClauses.length === 0) {
    return ['', []]
  }

  const orders: string[] = []
  const bindings: Bindings = []

  orderByClauses.forEach((clause) => {
    if (clause.rule) {
      const { column, direction, nulls } = clause.rule
      validateOrderDirection(direction)
      validateNulls(nulls)
      let orderStr = `${quotes(column as string)}`

      if (direction) {
        orderStr += ` ${direction}`
      }

      if (nulls) {
        orderStr += ` NULLS ${nulls}`
      }

      orders.push(orderStr)
    } else if (clause.raw) {
      orders.push(clause.raw.sql)
      if (clause.raw.bindings) {
        bindings.push(...clause.raw.bindings)
      }
    }
  })

  const sql = orders.length > 0 ? `ORDER BY ${orders.join(', ')}` : ''
  const result: SQLWithBindings = [sql, bindings]

  if (bindings.length > 0) {
    validateBindings(result)
  }

  return result
}
