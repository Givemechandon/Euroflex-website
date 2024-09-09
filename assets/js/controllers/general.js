
APP.controller.General = VtexClass.extend({
  init() {
    this.start()
    console.log('[ APP: GENERAL ]')
  },

  start: function () {
    var _that = this;
    this._prepareShelf()
    this._toggleMenu()
    this._isLoggedIn()
    this._mobileSearch()
    this._benefitsBar()
    this._tipbar()
    this._minicartHelper()
    this._cartQuantity()
    this._loadMore()


    APP.i.Footer = new APP.component.Footer()

    APP.i.Search = new APP.component.Search()

    APP.i.Menu = new APP.component.Menu()

    APP.i.Cart = new APP.component.Cart()

    APP.i.ecnLocation = new APP.component.ecnLocation()

    APP.i.helpers = new APP.component.helpers()


    this._backToTop()
    this._stickyNav()

    this._newsLetterPopup()
    this._closeNotify()

    this._lgpd()
  },

  _lgpd: function() {
    var _ec = {
		  getCookie: function() {
			  return document.cookie
		  },
	
		  verifyCookie: function(key) {
			  var cookie = _ec.getCookie();
	
			  if( cookie.indexOf(key) !== -1 ) {
				  var slice = cookie.split(key + '=')[1];
				  var content = slice.split(';')[0];
	
				  return content.trim();
			  } else {
				  return false;
			  }
	
		  },//verify
	
		  expireTime: function(days) {
			  var now = new Date();
			  var expires = now.getTime() + (days * 24 * 60 * 60 * 1000);
	
			  return new Date(expires);
		  },
	
		  createCookie: function(key, content, expires) {
			  var expires = expires || '';
			  document.cookie = key + '=' + content + ';' + 'expires=' + expires + '; path=/';
		  }
		}
	
		var popupClass = $('.lgpd');
	
		function removeClass () {
		  $(popupClass).removeClass('ativo')
		}
	
	
		$('body').on('click', '.lgpd__button', function(){
		  var time = _ec.expireTime(15);
		  _ec.createCookie('popupClass', 'inativo', time);
	
		  removeClass()
		})
	
		if (_ec.verifyCookie('popupClass')) {
		  removeClass()
		}else{
		  $(popupClass).addClass('ativo')
    }
  },

  _backToTop: function () {
    $(window).on('scroll', function () {
      let scrollPosition = window.pageYOffset || window.scrollTop;
      if (window.innerHeight < scrollPosition) {
        $('.back-totop').addClass('visible');
      } else {
        $('.back-totop').removeClass('visible');
      }
    })
  },

  _stickyNav: function () {
    let options = {
      offset: {
        up: 200,
        down: 50
      },
    };
    // grab an element
    var myElement = document.querySelector("header");
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(myElement, options);
    // initialise
    if (!$('body').hasClass('login')) {
      headroom.init();
    }

  },


  _minicartHelper: function () {
    $('.nav-cart--link').on('click', function (e) {
      e.preventDefault();
      $('body').addClass('minicart-is-open');
    })
  },

  _tipbar: function () {
     $('.tipbar__slider ul').slick({
        dots: false,
        arrows: false,
        autoplay: true,
        infinite: true,
        slidesToShow: 3,
        responsive: [{
          breakpoint: 996,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
      ]
      });
  },

  _benefitsBar: function () {
    if (window.innerWidth < 768) {
      $('.home__benefits-bar--wrapper ul').slick({
        dots: true,
        arrows: false,
        autoplay: true
      });
    }
  },

  _cartQuantity: function () {
    $(window).on('orderFormUpdated.vtex', function (e, orderForm) {

      var orderFormItems = 0;

      $.each(orderForm.items, function (index, value) {
        orderFormItems = orderFormItems + orderForm.items[index].quantity
      })

      $('.nav-cart--link').attr('data-quantity', orderFormItems);

      if (orderForm.items.length == 0) {

      }
    })

    vtexjs.checkout.getOrderForm()
  },


  _prepareShelf: function () {
    APP.i.flagDiscount = new APP.component.flagDiscount()
    APP.i.hasSale = new APP.component.hasSale()
    APP.i.hasSale = new APP.component.progressiveLoad()
    $('.helperComplement').remove()
  },

  _configure: function () {
    $('.header__bottom-in  > ul').clone().appendTo('.side_bar');
  },

  _toggleMenu: function () {
    $('.menu').on('click', function (e) {
      e.preventDefault();
      $('html').toggleClass('menu-is-open')
      if($('html').hasClass('search-is-open')){
        $('html').removeClass('search-is-open')
        $('.header__middle--search-box').hide()
      }
    })

    $('.header__bottom--nav--mobile-acount--close, #overlay').click(function (e) {
      e.preventDefault()
      $('body').removeClass('menu-is-open');
      $('html').removeClass('user-menu-is-open')
    });

    /*
    Open mobile items
     */
    $('.header__middle--menu').on('click', '.has-submenu>h3>span', function (e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        $(this).parent().toggleClass('active');
        $(this).parent().next('.submenu').toggle();
      }

    })
  },

  _isLoggedIn: function () {
    vtexjs.checkout.getOrderForm().done(function (orderForm) {
      // faz a verificação no atributo loggedIn
      if (orderForm.loggedIn) {
        var name = orderForm.clientProfileData.firstName;
        var email = orderForm.clientProfileData.email;
        var user;
        name === null || name === 'null' ? user = email : user = name;
        // var helcome = $('.account-user').text().replace('{{user}}', user)
        $('.header__bottom--nav--mobile-acount--head').html('Minha conta')
        $('.account-user').text(`Olá, ${user}`)
        $('.header__bottom--nav--mobile-acount--sub').show()
        $('.side_bar--mobile-acount-in>a').html('<span>Minha Conta</span>')
        $('.header__middle--nav--register').remove()
        $('html').addClass('logged')


        let submenuTemplate = `<div class="header__middle--nav--account--sub">
                                <ul>
                                  <li><a href="/_secure/account#/profile" class="account-user">Olá, ${user}</a></li>
                                  <li><a href="/_secure/account#/orders">Meus Pedidos</a></li>
                                  <li><a href="/_secure/account#/profile">Minha Conta</a></li>
                                  <li><a href="/no-cache/user/logout" class="sair">Sair</a></li>
                                </ul>
                              </div>`;

        $('.header__middle--nav--account').append(submenuTemplate)

        /*
        Actions*/
        $('.header__bottom--nav--mobile-acount--sub > a').on('click', function (e) {
          e.preventDefault();
          $('html').removeClass('user-menu-is-open');
        })

        $('.header__bottom--nav--mobile-acount--head').on('click', function (e) {
          e.preventDefault();
          $('html').addClass('user-menu-is-open');
        })
      } else {
        // var helcome = $('.account-user').text().replace('{{user}}', 'faça seu login')
        // $('.account-user').text('Olá, faça seu login')
        // $('.header__middle--nav--account--sub').remove()
        console.log('Não logado')
      }
    });
  },
  _mobileSearch: function () {

    $('.nav-search > a').on('click', function (e) {
      e.preventDefault();
      // if ($('html').hasClass('search-is-open') && window.innerWidth < 996) {
      //   let val = $('.search__form').find('input').val();
      //   location.href = '/' + val;
      //   e.stopPropagation();
      // }
      if($('html').hasClass('menu-is-open')){
        $('html').removeClass('menu-is-open')
      }
      $(this).toggleClass('active');
      $('.header__middle--search-box').toggle();
      $('html').toggleClass('search-is-open');


    })
    $('.nav-search .search__close, #overlay').on('click', function (e) {
      e.preventDefault();
      $('.header__middle--search-box').fadeOut();
      $('.header__middle--nav--search a').removeClass('active');
      $('html').removeClass('search-is-open');
    })

  },

  // TODO: Task-7079 
  _newsLetterPopup: function () {

    if(!$('body').hasClass('stable')) {
      let newsletter = Cookies.get('popupOfTheDay');
      let selectedState = Cookies.get('ECNselectedState');
      let purchasePolicy = $('#seletor-de-regiao option[value="' + selectedState + '"]').text();
  
      if (purchasePolicy != undefined && (!newsletter || newsletter !== 'true')) {
        $('html').one('mouseleave', function() {
          $('.ecn-lightbox .ecn-lightbox--wrapper--newsletter-popup').fadeIn();
        });
  
        $(document).on('click', '.ecn-lightbox--content--top--close, .ecn-lightbox--content--close', function () {
          $('.ecn-lightbox .ecn-lightbox--wrapper--newsletter-popup').fadeOut();
          Cookies.set('popupOfTheDay', 'true', {
            expires: 1
          });
        });
  
  
        this._sendNewsletter()
      }
    }

  },

  _closeNotify: function(){
    $('.ecn-lightbox--wrapper--notify').on('click', '.ecn-lightbox--content--close', function(e){
      e.preventDefault();
      $('.ecn-lightbox--wrapper--notify').fadeOut(function(){
        $('.ecn-lightbox--wrapper--notify .ecn-lightbox--content--body').html('');
      });
    });
  },

  _sendNewsletter: function () {
    var _that = this;

    let successMessage = `<i class="newsletter-success-icon"></i>
                          <h3>Parabéns!</h3>
                          <p>
                          Agora você ficará sabendo de todos os nossos lançamentos e promoções.
                          </p>
                          <a href="javascript:void(0)">Voltar ao site</a>
                          `;



    $('.ecn-lightbox--content form').validate({
      submitHandler: function (form) {

        const url = $(form).attr('action')
        //const type = $(form).attr('method')
        const type = 'patch'


        let _name = $(form).find('input[name="name"]').val();
        let email = $(form).find('input[name="email"]').val();

        let first_name = _name.split(' ')[0] || '';
        let last_name = _name.substring(first_name.length).trim() || '';


        let data = {
          'email': email,
          'firstName': first_name,
          'lastName': last_name
        }
        console.log('data', data);

        data = JSON.stringify(data);


        $.ajax({
          url,
          type,
          data,
          headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
            'Content-Type': 'application/json'
          }
        }).then(response => {
          console.log('success')
          $('.ecn-lightbox--wrapper--newsletter-popup .ecn-lightbox--content').addClass('success');
          $('.ecn-lightbox--wrapper--newsletter-popup .ecn-lightbox--content--body').addClass('success').html(successMessage);
          $(document).find('.ecn-lightbox--wrapper--newsletter-popup').on('click', '.success a',function(){
            $('.ecn-lightbox--wrapper--newsletter-popup').fadeOut();
            Cookies.set('newsLetterPopup', 'true', {
              expires: 1
            });
          })
        }, error => {

          var message = JSON.parse(error.responseText);
          // alert(message.Message);

        })

      }
    })
  },
  _loadMore: function() {
    let i = 6;
    // Ao clicar no botão, tira o display none dos próximos 4 produtos
    $(".ofertas__load").on("click", function(){
      $(".bf-shelf>ul:nth-child("+i+")").css("display", "unset");
      i++
      $(".bf-shelf>ul:nth-child("+i+")").css("display", "unset");
      i++
      $(".bf-shelf>ul:nth-child("+i+")").css("display", "unset");
      i++
      $(".bf-shelf>ul:nth-child("+i+")").css("display", "unset");
      i++
      if(i >= $('.bf-shelf>ul').length){
        $('.ofertas__load').css('display','none');
      }
    })
  }



})

if(window.location.href.includes('vtex')) {
  $('body').addClass('stable')
}
