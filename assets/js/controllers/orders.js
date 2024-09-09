APP.controller.Orders = VtexClass.extend({
  init () {
    this.start()
  },

  start () {
    this.removeBoostrap()
  },

  removeBoostrap () {
    $('link[href$="bootstrap.min.css"]').remove()
  }
})
