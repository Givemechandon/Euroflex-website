/* Js do Hotsite da kingsdown */

function startSlickSliderMainSlide(){
    $(".slides").slick({
        arrows: true,
        autoplay: true,
        infinite: true,
        vertical: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows_intro',
        nextArrow: '.arrow-right-first-slide',
        prevArrow: '.arrow-left-first-slide',
        dots: true,
    });
    $(".slidesM").slick({
        arrows: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows_intro-M',
        nextArrow: '.arrow-right-first-slide-M',
        prevArrow: '.arrow-left-first-slide-M',
        dots: true,
    });
    $('.container_KE').slick({
        arrows: false,
        autoplay: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        dots: false,
    });
    $('.container_KE-mobile').slick({
        arrows: false,
        autoplay: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        dots: false,
    });
    $('.element_image-dia').slick({
        arrows: true,
        autoplay: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows-dia',
        nextArrow: '.arrow-right-dia',
        prevArrow: '.arrow-left-dia',
        dots: false,
    });
    $('.element_image-pla').slick({
        arrows: true,
        autoplay: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows-pla',
        nextArrow: '.arrow-right-pla',
        prevArrow: '.arrow-left-pla',
        dots: false,
    });
    $('.element_image-mas').slick({
        arrows: true,
        autoplay: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows-mas',
        nextArrow: '.arrow-right-mas',
        prevArrow: '.arrow-left-mas',
        dots: false,
    });
    $('.element_image-wi').slick({
        arrows: true,
        autoplay: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows-wi',
        nextArrow: '.arrow-right-wi',
        prevArrow: '.arrow-left-wi',
        dots: false,
    });
    $('.slides_card').slick({
        arrows: true,
        autoplay: false,
        vertical: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        appendArrows: '.area_arrows-KE',
        nextArrow: '.arrow-right-KE',
        prevArrow: '.arrow-left-KE',
        asNavFor: '.container_KE',
        dots: false,
        responsive:[
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    asNavFor: '.container_KE-mobile',
                }
            }
        ]
    });
    // $('.arrow-right-KE').click(function(){
    //     $('.container_KE').slick('slickNext');
    //     $('.container_KE-mobile').slick('slickNext');
    // });
    // $('.arrow-left-KE').click(function(){
    //     $('.container_KE').slick('slickPrev');
    //     $('.container_KE-mobile').slick('slickNext');
    // });
}
startSlickSliderMainSlide();
