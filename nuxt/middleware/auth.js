export default async function({ store, redirect }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    redirect("/login")
  }

  await store.dispatch("auth/checkAuth", "verified")

  // メール認証済でない場合は認証メール再送信ページへリダイレクト
  if (!store.getters["auth/permission"]("verified")) {
    redirect("/resend")
  }
}
