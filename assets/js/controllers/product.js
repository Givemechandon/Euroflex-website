APP.controller.Product = VtexClass.extend({
    init: function () {
        var self = this;
        self.setup();
        self.start();
        self.bind();   

        APP.i.flagDiscount = new APP.component.flagDiscount();
        APP.i.ecnTabs = new APP.component.ecnTabs();
        APP.i.productGallery = new APP.component.productGallery();
    },

    setup: function () {
        this.shelfs = $('.product__shelf').find('.shelf__default>ul');
    },

    _buildProductSpecification: function () {
        $('#aditional-info')
            .find('.ecn-tabs__content--container')
            .html('<p>Informação indisponível</p>');
        $('#mattress-interior')
            .find('.ecn-tabs__content--container')
            .html('<p>Informação indisponível</p>');

        if (!$('.productDescription').html().length) {
            $('.productDescription').html('<p>Informação indisponível</p>');
        }
    },

    start: function () {
        window.location.pathname.includes('/p') &&
            this._removeThumbCor();
        this._productVideos();
        this._startSlicks();
        this._videoThumb();
        this._slickThumbs();
        this._changeNotifyTexts();
        // this.buyTogether();
        this._resizeThumbs();
        this._buildProductSpecification();
        this._onlineSale();
        this._changeQuantity();
        this._available();
    },

    _changeQuantity: function () {
        $(document)
            .find('.product__info--qty')
            .on('click', 'button', function (e) {
                e.preventDefault();
                let qtyMin = 1,
                    qtyMax = 100;
                let buyButton = $('.product__info--buy-cta').find(
                    'a[href*="/checkout/cart/add?"]'
                );
                let url = buyButton.attr('href');

                let btnAction = $(this);
                let qtyField = $('.product__info--qty').find("input[type='text']"),
                    quantity = parseInt(qtyField.val(), 10) || 0;

                if (btnAction.hasClass('pdp-qty--counter-minus')) {
                    if (quantity > qtyMin) {
                        quantity--;
                        qtyField.val(quantity);
                        url = url.replace(/qty=([^&]+)/gm, 'qty=' + quantity);
                        buyButton.attr('href', url);
                    }
                } else {
                    if (quantity < qtyMax) {
                        quantity++;
                        qtyField.val(quantity);
                        url = url.replace(/qty=([^&]+)/gm, 'qty=' + quantity);
                        buyButton.attr('href', url);
                    }
                }
            });
    },

    _onlineSale: function () {
        let onlineSale = $('.value-field.Venda-Online');

        if (onlineSale.length && onlineSale.text() === 'Não') {
            $('.product__shortDescription')
                .addClass('no-sale')
                .html(
                    '<p>Infelizmente não vendemos este produto aqui no site. Para mais informações sobre preço e prazo de entrega, visite uma de <a href="/institucional/nossas-lojas">nossas lojas</a> ou fale com um especialista.</p> <a href="/" class="back-btn">Voltar ao início</a>'
                )
                .show();
            $('.product__info--qty').remove();
        } else {
            $('.product__shortDescription').show();
            $('.pproduct__sku-selection').show();
            $('.product__info--buy-cta').show();
        }
    },

    _changeNotifyTexts: function () {
        $('.notifyme-title').text('Produto Indisponível');
        $('.notifyme-form p').text(
            'Quer ser avisado quando esse produto chegar? Preencha o campo abaixo com o seu e-mail e assim que chegar em nossas lojas, você será notificado(a).'
        );
        $('#notifymeClientEmail').attr('placeholder', 'E-mail');
        $('#notifymeClientName').attr('placeholder', 'Nome');
        $('#notifymeButtonOK').attr('value', 'Enviar');
        $('.sku-notifyme-success').text(
            'Pronto! Assim que nós estivermos esse produto disponível, notificaremos você por e-mail.'
        );
    },

    _startSlicks: function () {
        this._allShelfs();
    },

    _allShelfs: function () {
        this.shelfs.slick({
            dots: true,
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: false,
            infinite: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            ],
        });
    },

    _videoThumb: function () {
        new APP.component.videoThumb({
            fieldClass: '.value-field.Video',
            width: 400,
            height: 400,
            thumb: '/arquivos/thumb-video.jpg',
            positionThumb: 'bottom',
        });
    },

    _skuPicker: function () {
        let _that = this;
        $(window).on('skuDimensionChanged.vtex', function () {
            $('.apresentacao').hide().css('opacity', '0');
            if ($('.apresentacao ul.thumbs').hasClass('slick-initialized')) {
                $('.apresentacao ul.thumbs').slick('unslick');
            }

            setTimeout(function () {
                _that._slickThumbs();
                _that._resizeThumbs();
                $('.apresentacao').show().css('opacity', '1');
            }, 1000);
            $('.apresentacao').show();
        });
    },

    _available: function () {
        if (skuJson_0.available === true) {
            $('.product__info--qty').show();
        }
    },

    _slickThumbs: function () {
        var hasVideo = setInterval(myTimer, 1000);

        function myTimer() {
            if ($('.video-initialized.apresentacao').length) {
                $('.product__image')
                    .find('.thumbs')
                    .slick({
                        dots: false,
                        arrows: true,
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        autoplay: false,
                        infinite: false,
                        vertical: true,
                        responsive: [{
                            breakpoint: 769,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: true,
                                vertical: false,
                                dots: true,
                            },
                        },],
                    });

                clearInterval(hasVideo);
            }
        }
    },

    toRealFormat: function (price) {
        var formatedPrice = price.toFixed(2).split('.');
        return (
            (formatedPrice[0] = formatedPrice[0].split(/(?=(?:...)*$)/).join('.')),
            formatedPrice.join(',')
        );
    },

    buyTogether: function () {
        /*
        Change image
         */
        var buyTogetherImg = $('.product__buyTogether img');
        if (buyTogetherImg.length) {
            $('.product__buyTogether img').each(function () {
                var element = $(this);
                var src = $(this).attr('src').replace('90-90', '250-250');
                element.attr('src', src);
            });
        }
        $('.product__buyTogether')
            .find('#divTitulo')
            .html('<h3>Compre <span>junto</span></h3>')
            .show();
        $('.product__buyTogether').find('#divTitulo').show();

        /*
        Change texts
         */
    },

    _resizeThumbs: function () {
        if (window.innerWidth <= 768) {
            $('#show .thumbs img').each(function () {
                var element = $(this);
                var src = $(this).attr('src').replace('122-122', '1000-1000');
                element.attr('src', src);
            });
        }
    },

    bind: function () { },

    _productVideos: function () {
        // listener clicks
        document.addEventListener('click', function (e) {
            // abrir o modal do vídeo
            if (e.target.id == 'thumbVideo') {
                e.preventDefault();
                handleVideoThumbClick();
                return;
            }
            // fechar o modal do vídeo
            if (
                (e.target.hasAttribute('data-dismiss') &&
                    e.target.getAttribute('data-dismiss') == 'modal') ||
                e.target.classList.contains('modal-outter')
            ) {
                // o slickGoTo não está funcionando
                fakeSelect(1);
                var modal = document.querySelector('#video-modal');
                modal.remove();
            }
        });

        function fakeSelect(slideChildrenPosition) {
            const slide = document.querySelector(
                `.product__image .slick-track > div:nth-child(${slideChildrenPosition}) > div > li > a > img`
            );
            slide.click();
        }

        // request para o produto
        const settings = {
            "url": `/api/catalog_system/pub/products/search/?fq=productId:${skuJson.productId}`,
            "method": "GET",
            "dataType": "json",
            "async": false,
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        };

        $.ajax(settings).then(function (response) {
            const videos = getVideosFromProductItems(response[0].items);
            if (videos.length) insertVideosDOM(videos);

        }).fail(console.error());

        // fetch(url, options)
        //   .then((res) => res.json())
        //   .then((product) => {
        //     const videos = getVideosFromProductItems(product[0].items);

        //     insertVideosDOM(videos);
        //   })
        //   .catch((err) => console.error('error:' + err));

        function getVideosFromProductItems(items) {
            let videos = [];
            items.forEach((item) => {
                item.Videos.forEach((video) => {
                    videos.push(video);
                });
            });
            return videos;
        }

        function insertVideosDOM(videos) {
            videos.forEach((videoUrl) => {
                // mobile
                const videoThumbElement = createHtmlForVideoThumb(videoUrl, true);
                const productImageDiv = document.querySelector('.product__image');
                productImageDiv.insertAdjacentHTML('beforeend', videoThumbElement);

                // desktop
                if (window.innerWidth > 1199) {
                    const videoThumbElement = createHtmlForVideoThumb(videoUrl);
                    const sliderElementsList = document.querySelector('#show .thumbs');
                    sliderElementsList.insertAdjacentHTML('beforeend', videoThumbElement);
                }
            });
        }

        function createHtmlForVideoThumb(videoUrl, mobile = false) {
            const videoId = getYouTubeId(videoUrl);

            if (mobile) {
                return `
        <button 
          id="botaoVideo"
          class="thumbVideo-mobile"
          data-videoid="${videoId}" 
          title="Abrir o vídeo"
        >
          <img
            id="thumbVideo"
            src="/arquivos/product-video-thumb.png"
            title="Vídeo para ${skuJson.name}"
            alt="Vídeo para ${skuJson.name}"
          />
        </button>
      `;
            }

            return `
    <li class="slide-video">
      <a
        id="botaoVideo"
        class="thumbVideo-desktop"
        href="javascript:void(0);"
        title="Abrir o vídeo"
        data-index="1"
        data-videoid="${videoId}"
      >
        <img
          id="thumbVideo"
          src="/arquivos/product-video-thumb.png"
          title="Vídeo para ${skuJson.name}"
          alt="Vídeo para ${skuJson.name}"
        />
      </a>
    </li>
    `;
        }

        function getYouTubeId(url) {
            var ID = '';
            url = url
                .replace(/(>|<)/gi, '')
                .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if (url[2] !== undefined) {
                ID = url[2].split(/[^0-9a-z_\-]/i);
                ID = ID[0];
            } else {
                ID = url;
            }
            return ID;
        }

        function handleVideoThumbClick() {
            const videoId = document.querySelector('#botaoVideo').dataset.videoid;
            const videoIframe = `
              <iframe id="ytplayer" type="text/html" width="100%" height="580"
              src="http://www.youtube.com/embed/${videoId}?autoplay=1&mute=1" allowfullscreen
              frameborder="0"/>
          `;

            openModal(videoIframe);
        }

        function openModal(iframe) {
            const modal = `
              <div class="product-modal modal-outter" tabindex="-1" role="dialog" id="video-modal">
                  <div role="document" class="product-modal__dialog">
                  <div class="product-modal__container">
                      <div class="product-modal__header">
                      <button type="button" class="product-modal__close" aria-label="Fechar a visualização do vídeo">
                          <span aria-hidden="true" data-dismiss="modal">×</span>
                      </button>
                      </div>
                      ${iframe}
                  </div>
                  </div>
              </div>
          `;
            document.body.insertAdjacentHTML('beforeend', modal);
        }
    },

    _removeThumbCor: function () {
        const url = `/api/catalog_system/pub/products/search/?fq=productId:${skuJson.productId}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        fetch(url, options)
            .then((res) => res.json())
            .then((product) => {
                const productItens = product[0].items[0].images;
                for (var item in productItens) {
                    let imageLabel = productItens[item].imageLabel
                    let imageUrl = String(productItens[item].imageUrl)
                    let splitImgUrl = imageUrl.split("/");
                    //console.log(splitImgUrl[splitImgUrl.length - 1])

                    if (imageLabel === "Cor") {
                        let urlImgCompare = splitImgUrl[splitImgUrl.length - 1]
                        const thumbs = document.querySelectorAll('#show .thumbs li img')
                        for (var i = 0; i < thumbs.length; i++) {

                            let string = thumbs[i].src.indexOf(urlImgCompare) != -1

                            if (string) {
                                thumbs[i].parentNode.remove();
                            }
                        }
                    }
                }
            })
            .catch((err) => console.error('error:' + err));
    }

});



if ($('body').hasClass('prod')) {
    setTimeout(function () {
        $('.shipping-value').click();
        $('.freight-zip-box').attr('placeholder', 'Insira o seu CEP');
    }, 3000);
}



/* ======== TAREFA TASK 6526 =========== */
function mudarText(cep) {
    var removeTextFreteGratis = document.querySelectorAll('.freight-values');
    removeTextFreteGratis[0].children[0].children[1].children[0].children[1].innerText = `Frete Transportadora, entrega para o CEP ${cep}`;
    document.querySelector('#txtCep').click()

}

function selectionatext() {
    var cepTextFreteGratis = document.querySelectorAll('.freight-values')[0].children[0].children[1].children[0].children[1].innerHTML.split(" ")
    var quantItens = cepTextFreteGratis.length - 1
    mudarText(cepTextFreteGratis[quantItens])
}

function handleFreightValues() {
    if (document.querySelectorAll('.freight-values')[0] &&
        document.querySelectorAll('.freight-values')[0].style.display != 'none') {
        setTimeout(function () {
            selectionatext()
        }, 0)
    } else {
        setTimeout(function () {
            handleFreightValues()
        }, 1000)
    }
}


// Abrir e Fechar Modal Vídeo do Youtube Abaixo de "Colchão Simulado":
//Abrir:
$(document).on('click', '.icon-play-box', function(evt){
   evt.preventDefault()
   $('.container-modal-video').fadeIn(100)
})
//Fechar:
$(document).on('click','.container-modal-video .modal-btn-closed', function(evt){
    evt.preventDefault()
    $('.container-modal-video').fadeOut(100)
})
// Fechar Fora:
$(document).on('click','.container-modal-video',function(evt2){
    evt2.preventDefault()
    $('.container-modal-video').fadeOut(100)
})

window.addEventListener('click', handleFreightValues)
