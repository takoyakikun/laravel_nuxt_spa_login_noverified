export default async context => {
  await Promise.all([
    context.store.dispatch("auth/setUser", context),
    context.store.dispatch("config/setConfig", context)
  ])
}
