export const form = ({ context }) => {
  const methods = {
    submit: () => {
      context.emit('submit')
    }
  }

  return { methods }
}
