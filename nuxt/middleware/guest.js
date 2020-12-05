export default function({ store, redirect }) {
  // ユーザーがログインしている場合はTopページへリダイレクト
  if (store.getters["auth/userExists"]) {
    redirect("/")
  }
}
