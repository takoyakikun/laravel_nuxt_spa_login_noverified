export default async function({ store, redirect, app }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    return redirect("/login")
  }

  // アクセス権限を取得してストアにセットする
  await app.$api.auth.checkAuth(["admin-higher"])

  // 管理者以上でない場合はTopページへリダイレクト
  if (!store.getters["auth/permission"]("admin-higher")) {
    return redirect("/")
  }
}
