APP.component.Menu = VtexClass.extend({
    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    setup: function (options) {
        this.options = $.extend({
            $BODY: $('body'),
            $scope: $('.header__middle--menu'),
            class: '',
            WRAPPER: 1244,
            PHONEW: 320,
            TABLETW: 720,
            DESKW: 1024,
            DESKLARGEW: 1920,
            ACCOUNTNAME: "tezm99"

        }, options)
    },

    start: function () {
        this.buildMenu()
     },

    buildMenu: function () {
        let _that = this;
        const $_menuDepartamento = this.options.$scope.find('.menu-departamento');

        this.options.$scope.each(function () {
            let $_this = $(this);
            

            let _applyUserAction = function () {
                if (_that.options.DESKW < $(window).width()) {
                    $_menuDepartamento.find('.menu-item').off().on({
                        'mouseenter': function () {
                            $(this).addClass('active');
                            _that.options.$BODY.addClass('menu-active');
                        },
                        'mouseleave': function () {
                            $(this).removeClass('active');
                            _that.options.$BODY.removeClass('menu-active');
                        }

                    });

                } else {
                    $_menuDepartamento.find('.menu-item').off().on({
                        'click': function () {
                            if ($(this).hasClass('active')) {
                                $_menuDepartamento.find('.menu-item').removeClass('active');
                            } else {
                                $_menuDepartamento.find('.menu-item').removeClass('active');
                                $(this).addClass('active');
                            }
                        }
                    });
                }
            }

            $_menuDepartamento.find('a').each(function () {
                let thisLink = $(this).attr('href');

                $(this).attr('href', thisLink + '?O=OrderByReleaseDateDESC');
            })

            // $_menuDepartamento.prepend('<h3 class="newin"><a class="menu-item-texto" href="/busca/?fq=H:137">Novidades</a></h3>');
            // $_menuDepartamento.append('<h3 class="promocao"><a class="menu-item-texto" href="/busca/?fq=H:138"">Promoção</a></h3>');

            $_menuDepartamento.find("> ul").each(function () {
                if (!$(this).find("li").length) {
                    $(this).remove();
                } else {
                    $(this).wrap($('<div>', { 'class': 'submenu' })).wrap($('<div>', { 'class': 'content content-submenu' }))
                    // $(this).parents('.submenu').append(
                    // 	$('<div>',{'class':'content content-banner-menu'}).append(
                    // 		$('<div>',{'class':'banner-menu'})
                    // 	)
                    // )
                }
            });

            $_menuDepartamento.find('> h3').each(function () {
                let $_that = $(this);
                let depClass = $(this).removeClass('even').attr('class');
                let $_menuItem = $('<div>', { 'id': depClass, 'class': 'menu-item' })
                let $_bannerShelf = $('#banner-' + depClass)

                if ($_that.next(".submenu").length) {
                    $_that.next(".submenu").andSelf().wrapAll($_menuItem);
                    // $_that.append($('<i>', { 'class': "icon icon-arrow-down" })).parent(".menu-item").addClass('has-submenu');
                    $_that.parent(".menu-item").addClass('has-submenu');
                } else {
                    $_that.wrapAll($_menuItem);
                }
            })

            _applyUserAction()

            $(window).resize(function () {
                _applyUserAction()
            })

            $_menuDepartamento.find('> span').remove();
        });

        $_menuDepartamento.addClass('ready');
    },
    bind: function () {
    }
  })
