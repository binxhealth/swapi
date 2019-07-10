const Koa = require('koa')
const json = require('koa-json')
const { print, chalk: { yellow } } = require('@ianwalter/print')
const Router = require('@ianwalter/router')
const pkg = require('./package.json')

// Import the JSON data copied from http://github.com/phalt/swapi.
const people = require('./data/people.json')

// Create the Koa app instance.
const app = new Koa()

// Add error-handling middleware.
app.use(async function errorHandlingMiddleware (ctx, next) {
  try {
    await next()
  } catch (err) {
    print.error(err)
    ctx.status = err.statusCode || err.status || 500
  }
})

// Use middleware that automatically pretty-prints JSON responses.
app.use(json())

// Add the Access-Control-Allow-Origin header that accepts all requests to the
// response.
app.use(async function disableCorsMiddleware (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*')
  return next()
})

// Create the router instance.
const router = new Router('http://localhost:3000')

// Add a root route that provides information about the service.
router.add('/', ctx => {
  ctx.body = {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version
  }
})

// Add a route handler that returns 10 people per page.
router.add('/api/people', (ctx, { url }) => {
  const page = url.searchParams.get('page') || 1
  ctx.body = {
    count: people.length,
    results: people.slice((page - 1) * 10, page * 10).map(p => p.fields)
  }
})

// Add a 404 Not Found handler that is executed when no routes match.
function notFoundHandler (ctx) {
  ctx.status = 404
}

// Handle the request by allowing the router to route it to a handler.
app.use(ctx => router.match(ctx, notFoundHandler))

// Start listening on port 3000.
const server = app.listen(3000)
const { port } = server.address()
print.log('💫', yellow(`Let the force be with you: http://localhost:${port}`))

module.exports = server
