export default async context => {
  await Promise.all([
    context.app.$api.auth.getUser(),
    context.app.$api.config.getConfig()
  ])
}
