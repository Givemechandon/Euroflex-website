APP.controller.Support = VtexClass.extend({
    init: function() {
      this.setup()
      this.start()
      this.bind()
    },
  
    setup: function() {
  
    },
  
    start: function() {
      this.activeItemSidebar()
      this.generateSelect()
      this._questions()
      this._formContato()
    },
  
    activeItemSidebar: function() {
      $('.support__menu').find('ul li').each(function() {
        if (window.location.pathname == $(this).find('a').attr('href')) {
          $(this).find('a').addClass('active');
        }
      })
    },
    generateSelect: function() {
      let options = ``;
      $('.support__menu').find('ul li').each(function() {
        let link = $(this).find('a');
        let href = link.attr('href');
        let text = link.text();
        if (window.location.pathname == href) {
          options += `<option value="${href}" selected> ${text}</option>`;
        } else {
          options += `<option value="${href}"> ${text}</option>`;
        }
      })
      let select = `<select>
                    ${options}
                    </select>`;
      $('.support__menu').append(select);
  
      $(document).on('change', '.support__menu select', function() {
        let url = $(this).val();
        window.location = url;
      })
    },

    _questions: function(){
      $('.common-questions .common-questions__item > h3').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('open');
        $(this).next().slideToggle();
      })
    },

    _formContato: function(){
      const formContato = $('.form-fale-conosco').find('form');      
      formContato.on('submit', event => {
        event.preventDefault()
      })
      .validate({
        highlight: function(element) {
          $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        submitHandler: function(form) {
  
          const url = $(form).attr('action')
          const type = $(form).attr('method')
    
          const data = JSON.stringify($(form).serializeObject())
          console.log('data', data);
  
          $.ajax({
            url: url,
            type: type,
            data: data,
            dataType: 'json',
            headers: {
              'Accept': 'application/vnd.vtex.ds.v10+json',
              'Content-Type': 'application/json'
            }
          }).then(response => {

           $('.ecn-lightbox--wrapper--support .ecn-lightbox--content--body').html('<h3>Mensagem enviada com sucesso!</h3><p>Responderemos em breve.</p>');
           $('.ecn-lightbox--wrapper--support').fadeIn();
           $(form)[0].reset();
  
          }, error => {
  
            console.error('error', error)
            var message = JSON.parse(error.responseText);
            alert(message.Message);
  
  
          })
  
        }
      })
  
      $('.ecn-lightbox--wrapper .ecn-lightbox--content--close').on('click', function(e){
        e.preventDefault();
        $('.ecn-lightbox--wrapper--success').fadeOut();
      })
    },
  
  
  
  
  
    bind: function() {},
  
  
  })
  