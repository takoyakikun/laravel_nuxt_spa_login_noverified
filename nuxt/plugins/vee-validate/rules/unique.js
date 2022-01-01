// ユニークかどうかの判定

const validate = (value, { unique }) => {
  return unique(value)
}

const params = ['unique']

const message = 'この{_field_}は既に使用されています'

export default {
  validate,
  params,
  message
}
