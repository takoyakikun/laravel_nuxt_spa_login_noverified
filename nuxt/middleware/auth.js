export default async function({ store, redirect }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    redirect("/login")
  }
}
