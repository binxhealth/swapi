const Koa = require('koa')
const json = require('koa-json')
const { print } = require('@ianwalter/print')
const Router = require('@ianwalter/router')

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

//
const router = new Router('http://localhost:8181')

//
router.add('/api/people', (ctx, route) => {
  const page = route.searchParams.get('page') || 1
  ctx.body = people.slice((page - 1) * 10, page * 10)
})

//
function notFoundHandler (ctx) {
  ctx.status = 404
}

//
app.use(ctx => router.match(ctx, notFoundHandler))

app.listen(8181)
