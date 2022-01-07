---
to: "<%= composable ? ('composables/' + directory + '/' + (name ? name : 'index') + '.js') : null %>"
---
<%- include(actionfolder + includeComposable) %>
