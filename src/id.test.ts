import { describe, expect, it } from 'vitest'
import { createId } from './id'

describe('createId', () => {
  it('creates distinct non-empty ids', () => {
    const first = createId()
    const second = createId()

    expect(first).toBeTruthy()
    expect(second).toBeTruthy()
    expect(first).not.toBe(second)
  })
})
