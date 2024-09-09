APP.component.productGallery = VtexClass.extend({

    init: function (options) {
        this.setup(options)
        this.start()
    },

    setup: function (options) {
        this.options = $.extend({
            $scope: $('.product__image .thumbs')
        }, options)
    },

    makeGallery: function () {
        this.options.$scope.find('li').each(function (index) {
            $(this).find('a').attr('data-index', index);
            let img = $(this).find('img').attr('src').replace('122-122', '1500-1500');
            $('#productGallery').find('.productGallery__wrapper').append(`<div class="productGallery__item"><div class="productGallery__item--wrapper"><img src="${img}"/></div></div>`)
        })

        this.makeSlick();
    },
    bindGallery: function () {
        let _that = this;

        /*
        @TODO
        Refazer a galeria via API
        */

        if (window.innerWidth > 996) {
            $('.thumbs').on('click', 'a', function () {
                $('#image-main').on('click', function (e) {
                    e.preventDefault();
                    let index = _that.options.$scope.find('.ON').attr('data-index')
                    console.log('INDEX', index);
                    $('.productGallery__wrapper').slick('slickGoTo', parseInt(index));
                    $('#productGallery').addClass('show');
                })
            })

            $('#image-main').on('click', function (e) {
                e.preventDefault();
                let index = _that.options.$scope.find('.ON').attr('data-index')
                console.log('INDEX', index);
                $('.productGallery__wrapper').slick('slickGoTo', parseInt(index));
                $('#productGallery').addClass('show');
            })

        } else {
            $('.thumbs').on('click', 'a', function(e){
                e.preventDefault();
                let index = $(this).attr('data-index')
                console.log('INDEX', index);
                $('.productGallery__wrapper').slick('slickGoTo', parseInt(index) );
                $('#productGallery').addClass('show');
            })
        }


        $('#productGallery__close').on('click', function (e) {
            e.preventDefault();
            $('body').find('#productGallery').removeClass('show');
            console.log('close');
        })

    },

    makeSlick: function () {
        $('#productGallery').find('.productGallery__wrapper').slick({
            dots: false,
            arrows: true,
            responsive: [{
                breakpoint: 996,
                settings: {
                    arrows: false,
                    dots: true
                }
            }]
        });
    },


    start: function () {
        let _that = this;
        if (!$('#productGallery').length) {
            $('body').append('<div id="productGallery"><a id="productGallery__close" href="javascript:void(0)">Fechar</a><div class="productGallery__wrapper"></div></div>');
        }

        this.makeGallery();

        $(function () {
            _that.bindGallery();
        });



    }
})
