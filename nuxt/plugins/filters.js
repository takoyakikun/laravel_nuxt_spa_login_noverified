import Vue from 'vue'

// 文字数省略
Vue.filter('truncate', (text, length, clamp) => {
  text = text || ''
  clamp = clamp || '...'
  length = length || 30

  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + clamp
})
