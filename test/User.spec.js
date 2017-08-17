import test from 'ava'
import User from '../src/classes/User'

const { TEST_USER_ID } = process.env

test.before(t => {
  if (TEST_USER_ID == null || TEST_USER_ID === '') throw new Error('TEST_USER_ID must be defined')
})

test.beforeEach(t => {
  t.context.user = new User(TEST_USER_ID)
})

test('User has a constructor', t => {
  t.true(User.constructor != null, 'Constructor is undefined')
})

test('User without id throws error', t => {
  t.throws(() => new User())
})
