import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import VueMeta from 'vue-meta'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(Vuetify)
localVue.use(VueMeta, { keyName: 'head' })

const router = new VueRouter()
const vuetify = new Vuetify()

export { localVue, router, vuetify }
