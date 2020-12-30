export default async function({ store, redirect, app }) {
  // ユーザーがログインしていない場合はログインページへリダイレクト
  if (!store.getters["auth/userExists"]) {
    return redirect("/login")
  }
}
