---
to: "<%= test ? ('test/middleware/' + (name ? name : 'index') + '.spec.js') : null %>"
---
import axios from 'axios'
import makeMiddlewareOptions from '~/test/makeMiddlewareOptions'
import Middleware from '~/middleware/<%= name ? name : "index" %>'

jest.useFakeTimers()
jest.mock('axios')

let store
let redirect
let middlewareOptions
beforeEach(() => {
  middlewareOptions = makeMiddlewareOptions(axios)
  store = middlewareOptions.store
  redirect = middlewareOptions.redirect
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(__filename, () => {
  
})
