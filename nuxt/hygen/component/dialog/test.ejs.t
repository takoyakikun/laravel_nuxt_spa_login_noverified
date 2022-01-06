---
to: "<%= test ? ('test/components/' + directory + '/dialogs/' + (name ? name : 'index') + '.spec.js') : null %>"
---
<%- include(actionfolder + includeTest) %>
