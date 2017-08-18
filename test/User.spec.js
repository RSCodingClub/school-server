import test from 'ava'
import rewire from 'rewire'
import redisMock from 'redis-mock'
const User = rewire('../src/classes/User')

let { TEST_USER_ID } = process.env

test.before(t => {
  if (TEST_USER_ID == null || TEST_USER_ID === '') TEST_USER_ID = '1234'
})

test.beforeEach(t => {
  t.context.user = new User(TEST_USER_ID)
  // Overwrite redisClient in User to use mock redis
  User.__set__({
    redisClient: redisMock.createClient()
  })
})

test('User has a constructor', t => {
  t.true(User.constructor != null, 'Constructor is undefined')
})

test('User without id throws error', t => {
  t.throws(() => new User())
})
