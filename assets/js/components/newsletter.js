APP.component.Newsletter = VtexClass.extend({
  init: function (options) {
    this.setup(options)
    this.start()
    this.bind()
  },

  setup: function (options) {
    this.options = $.extend({
      $scope: $('.footer-newsletter'),
      $form: $('.newsletter__form'),

      classSuccess: 'footer-newsletter--success',
      classLoading: 'footer-newsletter--loading',
      classButtonSubmit: 'newsletter__submit',
      classError: 'newsletter__input--error',

      onSuccess: function () { },
      errorPlacement: function (error, $element) { }
    }, options)
  },

  start: function () { },

  bind: function () {
    this.bindSubmit()
  },

  bindSubmit: function () {
    this.options.$form
      .on('submit', event => {
        event.preventDefault()
      })
      .validate({
        errorClass: this.options.classError,
        submitHandler: form => {
          $(`.${this.options.classButtonSubmit}`).attr('disabled', 'disabled')

          this._submit(form)

          return false
        }
      })
  },

  _submit: function (form) {
    const url = this.options.$form.attr('action')
    // const type = this.options.$form.attr('method')
    const type = 'patch'
    const data = JSON.stringify(this.options.$form.serializeObject())

    this.options.$form.addClass(this.options.classLoading)

    $.ajax({
      url,
      type,
      data,
      headers: {
        'Accept': 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.options.$scope.toggleClass(this.options.classSuccess)
      this.options.$form.removeClass(this.options.classLoading)
      this.options.onSuccess()
      $('.newsletter__form')[0].reset();

    }, error => {
      throw new Error(error)

      this.options.$form.removeClass(this.options.classLoading)
      $(`.${this.options.classButtonSubmit}`).removeAttr('disabled')
    })
  }
})
