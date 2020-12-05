export default async function({ store, redirect }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    redirect("/login")
  }

  // アクセス権限を取得してストアにセットする
  await store.dispatch("auth/checkAuth", ["admin-higher"])

  // 管理者以上でない場合はTopページへリダイレクト
  if (!store.getters["auth/permission"]("admin-higher")) {
    redirect("/")
  }
}
