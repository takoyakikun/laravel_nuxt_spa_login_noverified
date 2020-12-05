export default async function({ store, redirect }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    redirect("/login")
  }

  await store.dispatch("auth/checkAuth", ["admin-higher", "verified"])

  // 管理者以上でない場合はTopページへリダイレクト
  if (!store.getters["auth/permission"]("admin-higher")) {
    redirect("/")
  }
  // メール認証済でない場合は認証メール再送信ページへリダイレクト
  if (!store.getters["auth/permission"]("verified")) {
    redirect("/resend")
  }
}
