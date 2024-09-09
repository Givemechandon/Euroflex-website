$(document).ready(function () {
    ShippingValue();

    function resizeThumbs() {
        if (window.innerWidth <= 768) {
            $('#show .thumbs img').each(function () {
                var element = $(this);
                var src = $(this).attr('src').replace('122-122', '1000-1000');
                element.attr('src', src);
            });
        }
    }

    var html = `
            <div class="fakeSelect">
                <div class="fakeSelect__active">Selecionar
                    <span class="fakeSelect__active__arrow"></span>
                </div>
                <div class="fakeSelect__options"></div>
            </div>
            `;

    if (!$('.fakeSelect').length) {
        $('.topic.Tamanho').append(html);
    }


    $('.Tamanho select option').each(function (index, element) {
        var value = $(this).val();
        var text = $(this).text();
        var option = `<div class="fakeSelect__option" data-value="${value}">${text}</div>`
        $('.fakeSelect__options').append(option);
    });

    $('.fakeSelect__option').on('click', function (evt) {
        evt.preventDefault();
    
        var text = $(this).text();
        var value = $(this).data('value');
        var arrow = `<span class="fakeSelect__active__arrow"></span>`
    
        $('.fakeSelect__active').text(text);
    
        setTimeout(() => {
            $('.Tamanho select').val(value).change();
        }, "100")

        $('.fakeSelect__active').append(arrow);
    });

    $(window).on('skuDimensionChanged.vtex', function () { 
        if ($('.apresentacao ul.thumbs').hasClass('slick-initialized')) {
            $('.apresentacao ul.thumbs').slick('unslick');
        }


       

        setTimeout(function () {
            resizeThumbs(); 
            
            setTimeout(function () {
                $('.apresentacao ul.thumbs').slick({
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
            }, 1000);

        }, 1000);


        
    })
    
    
    $(".fakeSelect__active, .fakeSelect__option").on("click", function () {
        if ($(".fakeSelect__options").hasClass("fakeSelect__options__active")) {
            $(".fakeSelect__options").removeClass("fakeSelect__options__active")
            $(".fakeSelect__active__arrow").removeClass("fakeSelect__active__arrow__focus")
        } else {
            $(".fakeSelect__options").addClass("fakeSelect__options__active");
            $(".fakeSelect__active__arrow").addClass("fakeSelect__active__arrow__focus");
        }
    
    });
});


