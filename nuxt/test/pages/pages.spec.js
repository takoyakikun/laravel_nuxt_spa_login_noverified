import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"
import storeConfig from "@/test/storeConfig"
import Index from "@/pages/index"
import Auth from "@/pages/auth"
import Login from "@/pages/login"
import Register from "@/pages/register"
import Users from "@/pages/users"
import PasswordReset from "@/pages/passwordReset/index"
import PasswordResetToken from "@/pages/passwordReset/_token"
import PasswordSetToken from "@/pages/passwordSet/_token"

const localVue = createLocalVue()
localVue.use(Vuex)

const vuetify = new Vuetify()

jest.mock("vuex")

let store
beforeEach(() => {
  store = new Vuex.Store(storeConfig)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("index", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Index, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })
})

describe("auth", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Auth, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test("authミドルウェアが登録されているか", () => {
    expect(wrapper.vm.$options.middleware).toContain("auth")
  })
})

describe("login", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Login, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test("guestミドルウェアが登録されているか", () => {
    expect(wrapper.vm.$options.middleware).toContain("guest")
  })
})

describe("register", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Register, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test("guestミドルウェアが登録されているか", () => {
    expect(wrapper.vm.$options.middleware).toContain("guest")
  })
})

describe("users", () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Users, { store, vuetify })
  })

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test("adminミドルウェアが登録されているか", () => {
    expect(wrapper.vm.$options.middleware).toContain("admin")
  })

  test("createdが実行されているか", () => {
    // spyOn
    const storeDispatch = jest.spyOn(wrapper.vm.$store, "dispatch")

    // createdのdispatchが実行されているか
    expect(storeDispatch).toHaveBeenCalledWith("users/setList")
    expect(storeDispatch).toHaveBeenCalledWith("users/setRoleOptions")
  })
})

describe("passwordReset", () => {
  describe("index", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordReset, { store, vuetify })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("guestミドルウェアが登録されているか", () => {
      expect(wrapper.vm.$options.middleware).toContain("guest")
    })
  })

  describe("_token", () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(PasswordResetToken, { store, vuetify })
    })

    test("is a Vue instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    test("guestミドルウェアが登録されているか", () => {
      expect(wrapper.vm.$options.middleware).toContain("guest")
    })
  })

  describe("passwordSet", () => {
    describe("_token", () => {
      let wrapper
      beforeEach(() => {
        wrapper = shallowMount(PasswordSetToken, { store, vuetify })
      })

      test("is a Vue instance", () => {
        expect(wrapper.vm).toBeTruthy()
      })

      test("guestミドルウェアが登録されているか", () => {
        expect(wrapper.vm.$options.middleware).toContain("guest")
      })
    })
  })
})
