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

