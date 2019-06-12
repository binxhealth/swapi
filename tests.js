const { test } = require('@ianwalter/bff')
const supertest = require('supertest')
const server = require('.')

test('root', async ({ expect }) => {
  const pkg = require('./package.json')
  const { body } = await supertest(server).get('/')
  expect(body.name).toBe(pkg.name)
  expect(body.description).toBe(pkg.description)
  expect(body.version).toBe(pkg.version)
})

test('list people', async ({ expect }) => {
  const { body } = await supertest(server).get('/api/people')
  expect(body.count).toBe(82)
  expect(body.results.length).toBe(10)
})
