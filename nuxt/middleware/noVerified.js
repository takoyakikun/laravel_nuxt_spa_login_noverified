export default async function({ store, redirect }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    redirect("/login")
  }

  await store.dispatch("auth/checkAuth", "verified")

  // メール認証済の場合はTopページへリダイレクト
  if (store.getters["auth/permission"]("verified")) {
    redirect("/")
  }
}
