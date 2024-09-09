/* $(document).ready(function() { */
if ($('body').hasClass('landpage')) {
    AOS.init();


    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


    var playerSlidePrincipal;
    var playerPopupPrincipal;

    function onYouTubeIframeAPIReady() {
        playerSlidePrincipal = new YT.Player('player__slide__principal', {
            height: '638',
            width: window.innerWidth,
            videoId: 'W94UfIC3jBc',
            enablejsapi: 1,
            playerVars: {
                loop: 1,
                playlist: 'W94UfIC3jBc'
            },
            events: {
                'onReady': function(e) {
                    e.target.mute();
                    e.target.playVideo();
                },
            }
        });

        playerPopupPrincipal = new YT.Player('video__popup--slide', {
            height: '580',
            /* width: '680', */
            width: '100%',
            videoId: 'qKDY3uIjcYA',
            enablejsapi: 1,
            playerVars: {
                loop: 1,
                playlist: 'qKDY3uIjcYA'
            },
            events: {
                'onReady': function(e) {
                    e.target.mute();
                    e.target.playVideo();
                },

            }
        });
    }


    window.onload = function(event) {

        const swiper = new Swiper(".slide__principal", {
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                480: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 50,
                }
            }
        });

        swiper.on('slideChange', function() {
            playerSlidePrincipal.seekTo(0);

        });
    };

    const swiperFade = new Swiper('.euro__faca__diferenca--slide', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        effect: 'fade',
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        fadeEffect: {
            crossFade: true
        },
        navigation: {
            nextEl: ".flex-next",
            prevEl: ".flex-prev",
        },
    });

    /* Função para contar dados */
    $('.count').each(function() {
        $(this).prop('Counter', 0).animate({
            Counter: parseInt($(this).text().split(',').join(''))
        }, {
            duration: 4000,
            easing: 'swing',
            step: function(now) {
                now = Number(Math.ceil(now)).toLocaleString('en');
                $(this).text(now);
            }
        });
    });






    /* Botão voltar ao topo */
    function backToTop() {
        let backToTopButton = document.querySelector('.back-to-top')
        if (window.scrollY >= 560) {
            backToTopButton.classList.add('show')
        } else {
            backToTopButton.classList.remove('show')
        }
    }

    /* Função que anima texto quando o scroll passa pela seção */
    function backgroundAnimateText() {
        let textAnimate = document.querySelector('.animated');
        if (window.scrollY >= 1220) {
            textAnimate.classList.add('active');
        }
    }

    /* Popup vídeo */

    const btnVideo = document.querySelector('#button');
    const videoModal = document.querySelector('.euro__popup__container--video');
    const btnClose = document.querySelector('.euro__modal--close');

    $('body').on('click', '#button', function() {
        $('.euro__popup__container--video').addClass('active')
    })
    $('body').on('click', '.euro__modal--close', function() {
        $('.euro__popup__container--video').removeClass('active')
    })
    $('body').on('click', '.euro__popup__container--video', function() {
        $('.euro__popup__container--video').removeClass('active')
    })

    // Botão close da seção produão ecomind na versão mobile    
    $('body').on('click', '.tipclose', function() {
        $('.euro__producao__ecomind--popup').hide()
    })


    /* Quando rolar  */
    window.addEventListener('scroll', () => {
        backToTop()
        backgroundAnimateText()
    })
}
/*  }) */



/* var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); */