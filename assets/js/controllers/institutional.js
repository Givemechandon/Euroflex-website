APP.controller.Institutional = VtexClass.extend({
  init: function () {
    this.setup()
    this.start()
    this.bind()

    APP.i.Stores = new APP.component.Stores()
  },

  setup: function () {

  },

  start: function () {
    this.menu()
    this.getStates()
    this._formContato()
    this._formPesquisa()
    this.checkTypeMobileDevice()
    this.sejaUmFranqueado()
    this.videoThumbs()
    this.solicitarOrcamento()
  },

  bind: function () {
    const _self = this;
    $('#state').on("change", function () {
      _self.getStores($('#state option:selected').attr('data-sigla'))
    });
    $('body').on('click', '.institutional__lojas-loja', function () {
      let nome = $(this).find('h5').text()
      _self.mountStoresView(nome)
    });

    $('body').on('click', '.view__back', function () {
      let view = $('.institutional__lojas-view')
      let lojas = $('.institutional__lojas')

      view.fadeOut()
      lojas.fadeIn()
    })
    /* $('.joinus__formulario form').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      _self.sendFormSF.call(_self, e);
    }); */
  },
  menu: function () {
    $(document).ready(function () {
      const path = window.location.pathname.toLowerCase();
      $(`.institutional__menu ul a`).filter((i, e) => {
        return ($(e).attr('href') || '').toLowerCase() == path;
      }).addClass('active');


      $(`body`).on('click', '.institutional__menu-mobile ul li', function () {
        $(this).parent('ul').toggleClass('active')
      });
    });
  },
  _formPesquisa: function () {
    const formContato = $('.form-pesquisa-satisfacao').find('form');
    formContato.on('submit', event => {
      event.preventDefault()
    })
      .validate({
        highlight: function (element) {
          $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
          $(element).closest('.form-group').removeClass('has-error');
        },
        submitHandler: function (form) {

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

            $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body').html('<h3>Mensagem enviada com sucesso!</h3>');
            $('.ecn-lightbox--wrapper--institutional').fadeIn();
            $(form)[0].reset();

          }, error => {

            console.error('error', error)
            var message = JSON.parse(error.responseText);
            alert(message.Message);


          })

        }
      })

    $('.ecn-lightbox--wrapper .ecn-lightbox--content--close').on('click', function (e) {
      e.preventDefault();
      $('.ecn-lightbox--wrapper').fadeOut();
    })
  },
  _formContato: function () {
    const formContato = $('.form-fale-conosco').find('form');
    formContato.on('submit', event => {
      event.preventDefault()
    })
      .validate({
        highlight: function (element) {
          $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
          $(element).closest('.form-group').removeClass('has-error');
        },
        submitHandler: function (form) {

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

            $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body').html('<h3>Mensagem enviada com sucesso!</h3>');
            $('.ecn-lightbox--wrapper--institutional').fadeIn();
            $(form)[0].reset();

          }, error => {

            console.error('error', error)
            var message = JSON.parse(error.responseText);
            alert(message.Message);


          })

        }
      })

    $('.ecn-lightbox--wrapper .ecn-lightbox--content--close').on('click', function (e) {
      e.preventDefault();
      $('.ecn-lightbox--wrapper').fadeOut();
    })
  },
  getStates: function () {
    const _self = this;
    if ($("body").hasClass("nossas-lojas")) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`,
        {
          method: 'GET'
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          data.map(dat =>
            $('#state').append(`<option value='${dat.id}' data-sigla='${dat.sigla}'>${dat.nome}</option>`)
          )
        }).then(function () {
          $("#lojas-loading").remove();
          $('#state').addClass('active')
          let filtro = 'estado'
          _self.filterSelectEstado(filtro)

        });
    }
  },

  getStores: function (estado) {
    let _this = this
    let fields = `&_fields=nome,mapa,estado,endereco,contato,cidade`
    let filterState = `?_where=estado=${estado}`
    $.ajax({
      url: `/api/dataentities/NL/search${filterState}${fields}`,
      headers: {
        "Accept": 'application/vnd.vtex.ds.v10+json',
        "rest-range": "resources=0-999"
      },
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      type: 'GET',
      cache: false
    }).success(function (data) {
      if (data[0]) {
        _this.mountStores(data)
      } else {
        alert('Nenhuma loja encontrada, Favor refazer a busca.')
      }
    })
  },

  filterSelectEstado: function (filtro) {
    let _this = this
    let fields = `?_fields=${filtro}`
    $.ajax({
      url: `/api/dataentities/NL/search${fields}`,
      headers: {
        "Accept": 'application/vnd.vtex.ds.v10+json',
        "rest-range": "resources=0-999"
      },
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      type: 'GET',
      cache: false
    }).success(function (data) {
      $.each(data, function (key, item) {
        console.log(item.estado)
        $(`#state option[data-sigla=${item.estado}]`).show()
      })
    })
  },
  mountStores: function (search) {
    const _self = this;
    $('.institutional__lojas-result').html('')
    search.map(s =>
      $('.institutional__lojas-result').append(
        `<li class="institutional__lojas-loja">
          <h5 class='institutional__lojas-nome'>${s.nome}</h5>
          <p class='institutional__lojas-endereco'>${s.endereco} - ${s.cidade}, ${s.estado}</p>
          <p class='institutional__lojas-contato'>${s.contato}</p>
        </li>`
      )
    )
  },

  mountStoresView: function (store) {
    let _this = this
    let fields = `&_fields=nome,mapa,estado,endereco,contato,cidade`
    let filterState = `?_where=nome='${store}'`
    $.ajax({
      url: `/api/dataentities/NL/search${filterState}${fields}`,
      headers: {
        "Accept": 'application/vnd.vtex.ds.v10+json',
        "rest-range": "resources=0-999"
      },
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      type: 'GET',
      cache: false
    }).success(function (data) {
      let s = data[0]
      let view = $('.institutional__lojas-view')
      let lojas = $('.institutional__lojas')

      view.html('')
      view.show()
      lojas.hide()
      $("html, body").animate({ scrollTop: 0 }, "slow");

      view.append(
        `<div class="view">
          <button class="view__back" type="button">voltar</button>
          <h2>Nossas Lojas</h2>
          <h3>${s.nome} - ${s.cidade}</h3>
          <div class='view__mapa'>${s.mapa}</div>
          <h5 class='view__nome'>${s.nome}</h5>
          <p class='view__endereco'>${s.endereco} - ${s.cidade}, ${s.estado}</p>
          <p class='view__contato'>${s.contato}</p>
        </div>`
      )
    })

  },

  videoThumbs: function () {
    (function () {
      getVideos();
    })();

    function getVideos() {
      var v = document.getElementsByClassName("youtube-player");
      for (var n = 0; n < v.length; n++) {
        var p = document.createElement("div");
        var id = v[n].getAttribute("data-id");

        var placeholder = v[n].hasAttribute("data-thumbnail")
          ? v[n].getAttribute("data-thumbnail")
          : "";

        if (placeholder.length) p.innerHTML = createCustomThumbail(placeholder);

        v[n].appendChild(p);

        $(p).on('click', function () {
          var parent = this.parentNode;
          createIframe(parent, parent.getAttribute("data-id"))
        })

      }
    }

    function createIframe(v, id) {
      var iframe = document.createElement("iframe");
      iframe.setAttribute(
        "src",
        "//www.youtube.com/embed/" +
        id +
        "?autoplay=1&color=white&autohide=2&modestbranding=1&border=0&wmode=opaque&enablejsapi=1&showinfo=0&rel=0"
      );
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("width", "560");
      iframe.setAttribute("height", "530");

      $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content').css('max-width', '900px')
      $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body').html(iframe).css('padding', '0');
      $('.ecn-lightbox--wrapper--institutional').fadeIn();
    }

    /**
    * Create custom thumbnail from data-attribute provided url
    * @param {string} url
    * @return {string} The HTML containing the <img> tag
    */
    function createCustomThumbail(url) {
      return (
        '<img class="youtube-thumbnail" src="' +
        url +
        '" alt="Youtube Preview" /><div class="youtube-play-btn"></div>'
      );
    }
    
    $('.ecn-lightbox--wrapper .ecn-lightbox--content--close').on('click', function (e) {
      e.preventDefault();
      $('.ecn-lightbox--wrapper').fadeOut(300, function () {
        setTimeout(() => {
          $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content').css('max-width', '');
          $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body').css('padding', '');
          $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body iframe').remove();
        }, 300)
      });
    })

  },

  sejaUmFranqueado: function () {
    const formFranqueado = $('.joinus__formulario').find('form');

    formFranqueado.on('submit', event => {
      event.preventDefault();
    })
      .validate({
        highlight: function (element) {
          $(element).closest('.joinus__control').addClass('validator__input')
        },
        unhighlight: function (element) {
          $(element).closest('.joinus__control').removeClass('validator__input')
        },
        submitHandler: function (form) {
          const nome = $("#nome").val();
          const email = $("#email").val();
          const telefone = $("#telefone").val();
          const cidade = $("#cidade").val();
          const capital = $("#capital").val();
          const indicacao = $("#indicacao").val();

          const options = {
            method: 'POST',
            headers: { Accept: 'application/vnd.vtex.ds.v10+json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: nome,
              email: email,
              telefone: telefone,
              cidade: cidade,
              capital: capital,
              indicacao: indicacao,
            })
          };

          fetch('/api/dataentities/SF/documents', options)
            .then(response => response.json())
            .then(response => {
              $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body').html('<h3>Cadastro realizado com sucesso!</h3><p>Seu cadastro foi realizado.<br> Fique de olho no seu e-mail.</p>');
              $('.ecn-lightbox--wrapper--institutional').fadeIn();
            })
            .catch(err => {
              $('.ecn-lightbox--wrapper--institutional .ecn-lightbox--content--body').html('<h3>Ocorreu um erro ao enviar as informações!</h3><p>Tente novamente em alguns instantes.</p>');
              $('.ecn-lightbox--wrapper--institutional').fadeIn();
            })

          $('.ecn-lightbox--wrapper .ecn-lightbox--content--close').on('click', function (e) {
            e.preventDefault();
            $('.ecn-lightbox--wrapper').fadeOut();
          })
        }
      })
  },

  solicitarOrcamento: function () {
    const formSolicitacao = $('.institucional__euro-container').find('form');

    $('#cep').mask('99999-999');
    $('#cnpj').mask('00.000.000/0000-00', { reverse: true });
    $('#telefone').mask('(00) 00000-0000');

    formSolicitacao.on('submit', event => {
      event.preventDefault();
    })
      .validate({
        highlight: function (element) {
          $(element).closest('.orcamento__input').addClass('validator__input')
        },
        unhighlight: function (element) {
          $(element).closest('.orcamento__input').removeClass('validator__input')
        },
        submitHandler: function (form) {
          const nome = $("#nome").val();
          const sobrenome = $("#sobrenome").val();
          const cep = $("#cep").val();
          const endereco = $("#endereco").val();
          const complemento = $("#complemento").val();
          const cnpj = $("#cnpj").val();
          const telefone = $("#telefone").val();
          const assunto = $("#assunto").val();
          const descricao = $("#descricao").val();

          const options = {
            method: 'POST',
            headers: { Accept: 'application/vnd.vtex.ds.v10+json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: nome,
              sobrenome: sobrenome,
              cep: cep,
              endereco: endereco,
              complemento: complemento,
              telefone: telefone,
              cnpj: cnpj.replace(/[^0-9]/g, ""),
              assunto: assunto,
              descricao: descricao
            })
          };

          fetch('/api/dataentities/ZZ/documents', options)
            .then(response => response.json())
            .then(response => {
              console.log(response);

              $('.orcamento__status').html('<h3 class="status-success">Solicitação enviada com sucesso!</h3>');
              $(form)[0].reset();

              setTimeout(() => {
                $('.orcamento__status h3').remove()
              }, 4000)
            })
            .catch(err => {
              console.error(err);

              $('.orcamento__status').html('<h3 class="status-danger">Não foi possível enviar os dados dados!</h3>');

              setTimeout(() => {
                $('.orcamento__status h3').remove()
              }, 4000)
            });
        }
      })
  },

  checkTypeMobileDevice: function () {
    if (navigator.userAgent.includes('iPhone')) {
      $('#state_new').addClass('iPhone')
      $('#city_new').addClass('iPhone')
    }
  }
})
