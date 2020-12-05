<template>
  <v-app id="inspire">
    <!-- サイドバー -->
    <SideBar v-model="drawer" />

    <!-- ヘッダー -->
    <Header :drawer="drawer" @drawer="setDrawer" />

    <!-- メインコンテンツ -->
    <v-content>
      <v-container class="fill-height" fluid>
        <nuxt />
      </v-container>
    </v-content>

    <!-- フッター -->
    <Footer />

    <!-- トップスクロールボタン -->
    <TopScroll />

    <!-- snackbar -->
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex"
import TopScroll from "~/components/topScroll/topScroll"
import Snackbar from "~/components/snackbar/snackbar"
import SideBar from "~/components/layouts/default/sideBar"
import Header from "~/components/layouts/default/header"
import Footer from "~/components/layouts/default/footer"

export default {
  components: {
    TopScroll,
    Snackbar,
    SideBar,
    Header,
    Footer
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      userExists: "auth/userExists",
      permission: "auth/permission",
      permissionExists: "auth/permissionExists"
    })
  },
  async created() {
    await this.$store.dispatch("auth/checkAuth", "admin-higher")
  },
  methods: {
    // サイドバーの状態をセット
    setDrawer(value) {
      this.drawer = value
    }
  }
}
</script>
