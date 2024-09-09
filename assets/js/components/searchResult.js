APP.component.SearchResult = VtexClass.extend({
  init: function (options) {
    this.setup(options)
  },

  setup: function (options) {
    this.options = $.extend({
      $totalSearchResult: $('.resultado-busca-numero:first .value'),
      $termsSearchResult: $('.resultado-busca-termo:first .value'),
    }, options)
  },

  getTotalSearchResult: function () {
    return this.options.$totalSearchResult.text()
  },

  getTermsSearchResult: function () {
    return this.options.$termsSearchResult.text()
  }
})
