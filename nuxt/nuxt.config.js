import colors from 'vuetify/es5/util/colors'

const fs = require('fs')

// 共通の設定
const baseEnv = fs.existsSync('./config/env.js')
  ? require('./config/env.js')
  : {}
// 各環境ごとの設定
const addEnv = fs.existsSync(`./config/env.${process.env.NODE_ENV}.js`)
  ? require(`./config/env.${process.env.NODE_ENV}.js`)
  : {}
// 共通の設定と各環境ごとの設定を併合する(同じ項目は各環境ごとの設定優先)
const env = { ...baseEnv, ...addEnv }

export default {
  ssr: false,
  publicRuntimeConfig: {},
  router: {
    base: env.ROUTER_BASE || '/'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: titleChunk => {
      const siteTitle = 'ログインテンプレート'
      return titleChunk ? `${siteTitle} - ${titleChunk}` : siteTitle
    },
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { hid: 'robots', name: 'robots', content: 'noindex' }
    ],
    //link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    href: 'router.base'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/api/setup',
    '~/plugins/filters',
    '~/plugins/vuetify',
    '~/plugins/snackbar',
    '~/plugins/dialog',
    '~/plugins/nuxt-client-init',
    '~/plugins/vee-validate/vee-validate'
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify', '@nuxtjs/composition-api'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: env.API_URL,
    credentials: true
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['@/assets/scss/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (!ctx.isDev) {
        const vueLoader = config.module.rules.find(
          rule => ~rule.loader.indexOf('vue-loader')
        )
        vueLoader.options.compilerModules = [
          {
            preTransformNode(astEl) {
              const { attrsMap, attrsList } = astEl
              if (attrsMap['data-test']) {
                delete attrsMap['data-test']
                const index = attrsList.findIndex(x => x.name == 'data-test')
                attrsList.splice(index, 1)
              }
              return astEl
            }
          }
        ]
      }
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    transpile: ['vee-validate/dist/rules']
  },
  generate: {
    dir: env.GENERATE_DIR,
    fallback: true,
    interval: 2000
  },
  vue: {
    config: {
      devtools: process.env.NODE_ENV !== 'production'
    }
  }
}
