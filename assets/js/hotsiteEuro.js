/* Js do Hotsite da eurocolchões */

function startSlickSliderMainSlide(){
    $(".slides").slick({
        arrows: false,
        autoplay: false,
        infinite: true,
        vertical: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 1500,
        dots: true,
    });
}

startSlickSliderMainSlide();