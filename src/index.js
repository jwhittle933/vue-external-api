// ExAPI main module
export default class ExAPI {
  constructor(opts = {}) {
    const { router, store, requestLayer = {} } = opts

    if (!router) return this._optsError('Router')
    if (!store) return this._optsError('Store')

    this.services = {}
    this.Router = Router
    this.Store = Store

    this._init(requestLayer)
    this._createServices()
  }

  _optsError(which) {
    console.error(`[${which}]: Options must include ${which}`)
  }

  _init(layer) {
    if (Reflect.has(layer, 'meta')) {
      this.meta = layer.meta
    }

    if (Reflect.has(layer, 'handlers')) {
      this._handlers = layer.handlers
    }

    if (Reflect.has(layer, 'helpers')) {
      this._helpers = layer.helpers
    }
  }

  _createServices() {
    Object.entries(this._handlers).forEach(
      ([resourceName, resourceMethods]) => {
        Object.assign(this.services, {
          [resourceName]: this._createService(
            this.Router,
            this.Store,
            resourceName,
            resourceMethods,
          ),
        })
      },
    )
  }

  // createService wraps all s3 accessors in a proxy
  // for custom logic on lookups (caching/error handling)
  // Router and Store are capital to indicate that
  // these are Vue instances not primitive values
  _createService(Router, Store, name, handlers) {
    this.meta(Store, name)
    return new Proxy(handlers, {
      // Anytime a property on the object is accessed,
      // the Proxy calls the get method and injects
      // the initial object as well as the method called
      //
      // this.$resources.blog.list(pageNumber)
      // => [BlogPost, BlogPost, ...]
      //
      // this.$resources.blog.featured()
      // => [BlogPost, BlogPost, BlogPost]
      get(obj, method) {
        if (Reflect.has(obj, method)) {
          return async function(...args) {
            await obj[method](Store, ...args)
          }
        } else {
          console.error(`Request object has no method ${method}`)
        }
      },
    })
  }

  _services() {
    return this.services
  }

  // for Vue.use
  install(Vue) {
    Vue.prototype.$resources = this._services()
  }
}

