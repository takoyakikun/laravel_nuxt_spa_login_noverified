import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import registerRequireContextHook from 'babel-plugin-require-context-hook/register'
import './__mocks__/intersectionObserverMock'

Vue.use(Vuetify)
const app = document.createElement('div')
app.setAttribute('data-app', true)
document.body.append(app)

Vue.use(Vuex)

require('~/plugins/vee-validate/vee-validate')

registerRequireContextHook()
