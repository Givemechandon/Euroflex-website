APP.component.Footer = VtexClass.extend({
  init: function(options) {
    this.setup(options)
    this.start()
    this.bind()
  },

  setup: function(options) {

  },

  start: function() {
    this._newsLetter()
    this._toggleNavigation()
  },

  _newsLetter: function() {
    $('form.newsletter__form').on('submit', event => {
      event.preventDefault()
    })
    .validate({
      submitHandler: function(form) {

        const url = $(form).attr('action')
        // const type = $(form).attr('method')
        const type = 'patch'


        // let _name = $(form).find('input[name="firstName"]').val();
        let email = $(form).find('input[name="email"]').val();

        // let first_name = _name.split(' ')[0] || '';
        // let last_name = _name.substring(first_name.length).trim() || '';


        let data = {
          'email': email,
          // 'firstName': first_name,
          // 'lastName': last_name,
          'isNewsletterOptIn': true
        }
        console.log('data', data);

        let post = JSON.stringify(data);

        console.log('email', email);



        $.ajax({
          url: url,
          type: type,
          data: post,
          dataType: 'json',
          headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
            'Content-Type': 'application/json'
          }
        }).then(response => {

         $('.ecn-lightbox--wrapper--success').fadeIn();
         $('.newsletter__form')[0].reset();

        }, error => {

          console.error('error', error)
          var message = JSON.parse(error.responseText);
          alert(message.Message);


        })

      }
    })

    $('.ecn-lightbox--wrapper--success .ecn-lightbox--content--close, .ecn-lightbox--content--body a').on('click', function(e){
      e.preventDefault();
      $('.ecn-lightbox--wrapper--success').fadeOut();
    })
  },

  _toggleNavigation: function(){
    $('.footer__navigation--item').on('click', 'h6', function(e) {
      e.preventDefault();
      $(this).toggleClass('open');
      $(this).next().slideToggle();
    });
  },

  bind: function() {

  }
})
