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
  t.is(typeof User.constructor, 'function', 'Constructor is not a function')
})

test('User without id throws error', t => {
  t.throws(() => new User())
})

test('User has a name', async t => {
  let { user } = t.context
  t.true(user.getName != null, 'User#getName is not defined')
  t.is(typeof user.getName, 'function', 'User#getName is not a function')

  let name = await user.getName()
  t.is(name, '', 'User#getName returned an unexpected value')
})

test('User can change name', async t => {
  let { user } = t.context
  let newName = 'George Costanza'
  t.true(user.setName != null, 'User#setName is not defined')
  t.is(typeof user.setName, 'function', 'User#setName is not a function')

  await user.setName(newName)
  let name = await user.getName()
  t.is(name, newName, 'User#getName returned an unexpected value')
})
