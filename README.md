# ExAPI (vue-external-api)
ExAPI is a Vue plugin for managing external resources conveniently. The intent is to expose your request layer to the Vue instance, with the potential to connect it to Vuex and VueRouter logic.

## Example
```js
// main.js
import ExAPI from 'vue-external-api'
import router from './path/to/router.js'
import store from './path/to/store.js'
import requestLayer from './path/to/requestLayer.js'

const exAPI = new ExAPI({ router, store, requestLayer })
Vue.use(exAPI)

// someComponent.js
export default {
  data() {
    return {
      pageNumber: 1,
    }
  },
  created() {
    this.$resources.blog.list(this.pageNumber)
    // => [BlogPost, BlogPost, ...]

    this.$resources.blog.featured()
    // => [BlogPost, BlogPost, BlogPost]
  }
}
```

## Arguments
The ExAPI class accepts an objeect with three keys: router, store, and requestLayer. Each of these will be enumerated below.

### Request Layer
The request layer that ExAPI accepts is an object that contains all the fetching logic required for your app. The layer itself can contain any logic you need, i.e., axios requests, S3 bucket fetches, etc. The request layer object must look like this:
```js
{
  init: (Store, resourceName) => {
    // initialization logic here
    // init will be called once for every resource under handlers,
    // and the resourceName will be the key,
    // i.e., "blog"
  },
  routing: {
    // http response codes with routing logic
    // if this type of routing isn't necessary, you can exclude this field
    // as well as the Router from ExAPI.
    200: Router => {},
    401: Router => {},
    404: Router => {},
  },
  handlers: {
    // each key under handlers is a scoped block of requests.
    blog: {
      featured: Store => {},
      list: (Store, pageNumber) => {}
    },
    comments: {
      listByBlogId: (Store, id) => {}
    }
  }
}

```

### Router
ExAPI accepts a Vue Router instance, and will pass it to your navi

