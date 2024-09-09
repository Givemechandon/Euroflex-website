APP.controller.EmptySearch = VtexClass.extend({
  init: function() {
    this.setup()
    this.start()
  },

  start: function() {
    this.searchTerm()
  },

  setup: function(){
    
  },

  searchTerm: function () {
    var term = vtxctx.searchTerm;
    if(term === 'Sistema') {
        term = window.location.search.split('ft=')[1].split('&')[0];
        if(term !== undefined) {
            $('#search-term').text(`"${term}".`);
        }
    }
  },


})
