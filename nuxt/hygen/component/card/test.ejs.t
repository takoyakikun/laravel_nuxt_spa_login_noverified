---
to: "<%= test ? ('test/components/' + directory + '/' + (name ? name : 'index') + '.spec.js') : null %>"
---
<%- include(actionfolder + includeTest) %>
