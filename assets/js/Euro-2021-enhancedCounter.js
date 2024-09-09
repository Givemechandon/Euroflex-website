// Elemento que precisa ser criado
// <div class="an1Counter">
//  <div id="counter-date" data-time="{'data':'25/11/2016','hora':'00:00'}" style="display:none"></div>
// </div>

/* OPCIONAL */
/* TODAS AS CONFIGURACOES POSSIVEIS */
// var img ={
//  url: "/arquivos/buettner-bf-logo.png",
//  alt: "Black Friday",
//  title: "Contador da Black Friday!"
// };

// var timeobj = {
//     data: '23/12/2021',
//     hora: '15:59'
//   }
// var n = '<div id="counter-date" data-time='+ JSON.stringify(timeobj) +'></div>'
// $('.an1Counter').html(n)


$.fn.EnhacedCounter = function (userConf) {

    var mainElement = this,
        finalTime = "",
        hasUserConf = !!userConf,
        remainingTime = "",
        conf = {
            timeEl: '#counter-date',
            img: false,
            callbackFinished: function () {
                console.log('finalizado')

                mainElement.remove()

            },
            callbackRefresh: function () {
            }
        };


    function parseUserConf(userConf) {
        var confName = "";
        for (confName in userConf) {
            if (userConf.hasOwnProperty(confName) && !!userConf[confName]) {
                conf[confName] = userConf[confName];
            }
        }
    };

    function userAtMobile() {

        var userAgent = navigator.userAgent || navigator.vendor || window.opera.substr(0, 4),
            checkRegExp1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent),
            checkRegExp2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent)

        if (checkRegExp1 || checkRegExp2) {
            return true;
        }
        return false;

    }

    function msToObj(duration) {
        // duration = parseInt(duration, 10);
        var milliseconds = parseInt((duration % 1000) / 100, 10),
            seconds = parseInt((duration / 1000) % 60, 10),
            minutes = parseInt((duration / (1000 * 60)) % 60, 10),
            /* hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10), */
            hours = parseInt((duration / (1000 * 60 * 60)), 10),
            days = parseInt(duration / (1000 * 60 * 60 * 24), 10);

        return {
            "days": days,
            "hours": hours + days,
            "minutes": minutes,
            "seconds": seconds,
            "milliseconds": milliseconds
        };




    };

    function parseData(data) {
        //recebe a data no formato 11/11/1111
        data = data.split('/');
        return data[1] + " " + data[0] + ", " + data[2];
    };

    function getFinalTime() {
        var finalTimeObj = JSON.parse(mainElement.find(conf.timeEl).attr('data-time').split("'").join('"')),
            // date = parseData(finalTimeObj.data),

            date = finalTimeObj.data,
            time = finalTimeObj.hora;



        console.log('TIME ' + typeof (time))




        console.log('finalTimeObj', finalTimeObj)

        var day = date.split('/')[0]
        var month = parseInt(date.split('/')[1]) - 1
        var year = date.split('/')[2]
        var hours = time.split(':')[0]
        var minutes = time.split(':')[1]
        var seconds = '00'
        var milliseconds = '00'


        mainElement.find(conf.timeEl).remove();
        // return new Date(date + ' ' + time);

        return new Date(year, month, day, hours, minutes, seconds, milliseconds)
    };


    function getRemainingTime(finalTime) {
        var now = new Date(),
            timeDiff = finalTime.getTime() - now.getTime();



        // console.log("FINALTIME", finalTime.getTime(), "TYPE", typeof finalTime.getTime());
        // console.log("NOW", now.getTime(), "TYPE", typeof now.getTime());
        // console.log("timeDiff", timeDiff);
        return msToObj(timeDiff);
    };

    function checkSingleChar(str) {
        if (str.length == 1) {
            return '0' + str;
        } else {
            return str;
        }
    };

    function createElements() {

        var mobile = (!userAtMobile()) ? "" : "atMobile",
            html = ""; //enhacedCounter
        html += '<div class="enhacedCounter__container">';
        html += '<div class="enhacedCounter ' + mobile + '">';

        if (conf.img) {
            html += '<div class="enhacedCounter__logo">';
            html += '<img src="' + conf.img.url + '" title="' + conf.img.title + '" alt="' + conf.img.alt + '">';
            html += "</div>";
        }

        /*  html += '<div class="enhacedCounter__time -days">'; */
        // html += '<span>Dias</span>';
        /*  html += '<div class="enhacedCounter__number -days" ></div>';
         html += "</div>"; */

        html += '<div class="enhacedCounter__time -hours">';
        // html += '<span>Horas</span>';
        html += '<div class="enhacedCounter__number -hours" ></div>';
        html += "</div>";
        html += '<div class="enhacedCounter__time -minutes">';
        // html += '<span>Minutos</span>';
        html += '<div class="enhacedCounter__number -minutes" ></div>';
        html += "</div>";
        html += '<div class="enhacedCounter__time -seconds">';
        // html += '<span>Segundos</span>';
        html += '<div class="enhacedCounter__number -seconds" ></div>';
        html += "</div>";
        html += "</div>";
        html += "</div>";


        mainElement.html(html);

    };


    function updateElements(time) {
        var days = time.days.toString().padStart(2, '0');
        var hours = time.hours.toString().padStart(2, '0');
        var minutes = time.minutes.toString().padStart(2, '0');
        var seconds = time.seconds.toString().padStart(2, '0');

        var $daysnode = $('.enhacedCounter__number.-days');
        var $hoursnode = $('.enhacedCounter__number.-hours');
        var $minutesnode = $('.enhacedCounter__number.-minutes');
        var $secondsnode = $('.enhacedCounter__number.-seconds');

        if (days == "00") {
            $daysnode.html("")
        } else {
            $daysnode.html(days + ":")
        }
        $minutesnode.html(minutes + ":")
        $hoursnode.html(hours + ":")
        $secondsnode.html(seconds)
    };

    function refresh() {
        remainingTime = getRemainingTime(finalTime);
        if (remainingTime.seconds >= 0) {
            conf.callbackRefresh()
            updateElements(remainingTime)
            window.setTimeout(function () {
                refresh();
            }, 500)

        } else {
            conf.callbackFinished()
        }
    }

    // CARROSSEL DE SELOS :

    function carrosselHomeHandle() {
        $(document).on('click', 'div.seal', function () {
            var newText = this.querySelector('.change-text').innerText
            $('.seals-info-container .complete-info .content-info span').html('')  // aqui fiz com que o ".html" "limpasse" sempre sem conteúdo antes de receber um novo texto ou a "newText".
            $('.seals-info-container .complete-info .content-info span').html(newText)
        })

        $(document).on('mousemove', 'div.seal', function () {
            var newText = this.querySelector('.change-text').innerText
            $('.seals-info-container .complete-info .content-info span').html('')
            $('.seals-info-container .complete-info .content-info span').html(newText)
        })

        $('.seals-info-container .carrosel-seals').slick({
            dots: false,
            infinite: true,
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false
                    }
                },

            ]
        });
    }




// SLIDER MOBILE DO BANNER PRINCIPAL QUE SE ADAPTA A IMAGEM INSERIDA:

// if ($('body').hasClass('stable')) {           // em "stable"
function bannerPrincipalSlide(){
    console.log("testando slide adaptado")

    $('.home__webdoor--slider').slick('destroy') // "destruindo o Slide anterior, criando um novo"
    $('.home__webdoor--slider').slick({
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 1000,
        infinite: true,
        cssEase: "linear",
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    fade: false,
                },
            },
        ],
    }) 
}
// } 



  // BOTÃO "VER MAIS PRODUTOS" DA LANDPAGE "EURO-Landpage-2022":

let nextStop = 11 
let isShow = 5

$(document).on('click', '.LP-btn-shelf', function(){
    $('.shelf__default').children('ul').children('li').each((i,e) => {
        if (i <=  nextStop && i > isShow) {
            $(e).fadeIn(1150);
            isShow++
        }
    })

    nextStop = nextStop + 6

    if (isShow >= $('.shelfdefault').children('ul').children('li').length-1) {
        $('.LP-btn-shelf').hide();
    }
})



  // POPUP DO CASHBACK DA LANDPAGE: "EURO-Landpage-2022":
  // abrir:
  $(document).on('click', '.popup-cashback', function (evt) {
    evt.preventDefault()
    $('.container-popup-cashback').fadeIn(500)
})
  // esconder:
  $(document).on('click', '.container-popup-cashback .close-btn', function (evt) {
    evt.preventDefault()
    $('.container-popup-cashback').fadeOut(500)
})


    function init() {
        window.onload = function() {
            bannerPrincipalSlide()
        }
        carrosselHomeHandle();
        finalTime = getFinalTime();
        createElements();
        refresh();
    };


    if (hasUserConf) {
        parseUserConf(userConf);
    }
    init();
};



// $.fn.EnhacedCounter();

var configs = {
    timeEl: '#counter-date',

    callbackFinished: function () {

        document.querySelector('.an1Counter').classList.add('offTime');
        setTimeout(function () {
            $('.cronometro').css('display', 'none');
        }, 600);
        /* $('.black-friday').css('display', 'none');
        $("#zendeskChat").css("bottom", "7px");
        $("#returnToTop").css("bottom", "77px"); */
    },

    /* callbackRefresh: function() {
        //   console.log('refresh callback')
    } */
}





$('.an1Counter').EnhacedCounter(configs)

