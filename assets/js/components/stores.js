APP.component.Stores = VtexClass.extend({
    init: function (options) {
        
        if(!$('body').hasClass('novo')) return 
        this.start()
        this.bind()
    },

    bind: function() {
        this.events()
    },

    start: function() {

        let _this = this

        if($('body').hasClass('interna'))  {
            $('.institutional__lojas').remove()
        }
        _this.initFilters(_this.filters.bind(this))
        .then(function() {

            if($('body').hasClass('interna')) {
                _this.internMap()
            } else {
                _this.initMap()
                _this.setMarkers()
            }
        })
    },

    string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
    
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    
        return str;
    },

    internMap() {

        let store = this.stores[0]
        let view = $('.institutional__lojas-view-new')
        let _this =  this
        let page = window.location.pathname.split('/')[3]

        store = this.stores.find(function(s) { return _this.string_to_slug(s.nome) == page})


        view.append(
            `<div class="view">
              <button class="view__back" type="button">voltar</button>
              <h2>Nossas Lojas</h2>
              <h3>${store.nome} - ${store.cidade}</h3>
              <div class='view__mapa' id='map2'>${store.mapa}</div>
              <h5 class='view__nome'>${store.nome}</h5>
              <p class='view__endereco'>${store.endereco} - ${store.cidade}, ${store.estado}</p>
              <p class='view__contato'>${store.contato}</p>
            </div>`
        )

        // if(store.latitude && store.longitude) {

        //     $('#map2').empty()

        //     this.map = new google.maps.Map(document.getElementById('map2'), {
        //         zoom: 19,
        //         center:  {lat: Number(store.latitude), lng: Number(store.longitude)},
        //         mapTypeControl: google.maps.MapTypeId.ROADMAP,
        //     });

        //     _this.setMarkers()
        // }

    },

    initMap: function() {

        const _this = this

        _this.getIP()
        .done(function(data) {

            const {city } = data
            const store = _this.stores.find(function(st) { return st.cidade == city})
            const mapa = store ? store.mapa : _this.stores[0].mapa
            $('#map').append(mapa)
        })
        .fail(function() {

            const store = _this.stores[0]
            const { mapa } = store
            $('#map').append(mapa)
        })

        $('#map').append('<img src="/arquivos/Lojas.jpg" />')

        // this.map = new google.maps.Map(document.getElementById('map'), {
        //     zoom: 3,
        //     center:  {lat: -15.286141482367439, lng: -48.75174770885586 },
        //     mapTypeControl: google.maps.MapTypeId.ROADMAP,
        // });
    },

    getIP: function() {
        return $.ajax ({
            url: `https://www.cloudflare.com/cdn-cgi/trace`,
            type: 'GET',
            cache: false
        })
        .then(function(data) {
            let ip = data.split('=')[3].replace(/\nts/g, '');

            return $.ajax ({
                url: `https://ipapi.co/${ip}/json/`,
                type: 'GET',
                cache: false
            })
        })
    },

    setMarkers: function(params) {


        const locations = this.stores.filter(function(store) {return store.latitude && store.longitude})
        let selectedInfoWindow =  null

        const markers = locations.map((store, i) => {
            
            const marker =  new google.maps.Marker({
                position: {lat: Number(store.latitude), lng: Number(store.longitude), },
                icon: '/arquivos/Icon ionic-ios-pin.png',
                map: this.map
            });

            const infowindow = new google.maps.InfoWindow({
                content: `
                    <div class="marker-content">
                        <h3 class="marker-title">${store.nome}</h3>
                        <p class="marker-address">${store.endereco}</p>
                        <p class="marker-contact">${store.contato}</p>
                    </div>
                
                `,
            });


            marker.addListener("click", () => {
                if(selectedInfoWindow) {selectedInfoWindow.close()}

                infowindow.open(map, marker);
                selectedInfoWindow = infowindow
            })

            return marker

        })
    },

    events: function(params) {

        let _this = this
        let container = $('.institutional__lojas-result_new')


        $('#state_new').on('change',function() {
            container.empty()
            _this.setFilterCities($(this))
        })

        $('body').on('click', '.institutional__lojas-btn.active', function(params) {
            _this.setResults()
        })

        $('body').on('click', '.institutional__lojas-mapper', function(params) {
            _this.changeLocationMap($(this))
        })

        $('body').on('click',  '.view__back', function(e) {
            e.preventDefault()
            e.stopPropagation()
            window.location.href = "/institucional/nossas-lojas"
        })
    },

    filters: function(stores, states) {
        this.setFilterStates(states)
    },

    changeLocationMap: function(el) {


        let lat = el.data('lat')
        let lng = el.data('lng')
        let name = el.data('name')

        if(name) {
            window.location.href = `${window.location.pathname}/${name}`
        }

        if(lat == null || lng == null) return

        this.map.setZoom(20);
        this.map.setCenter({lat, lng});

    },

    setResults: function(params) {

        let city = $("#city_new").find(":selected").val()
        let stores = this.stores.filter(function(item) {return item.cidade == city })
        let container = $('.institutional__lojas-result_new')
        let _this =  this

        container.empty()

        stores = stores.sort(function(a, b){
            if(a.nome < b.nome) { return -1; }
            if(a.nome > b.nome) { return 1; }
            return 0;
        })

        for (const store of stores) {

            container.append(
                `<li class="institutional__lojas-loja_new">
                  <h5 class='institutional__lojas-nome'>${store.nome}</h5>
                  <p class='institutional__lojas-endereco'>${store.endereco} - ${store.cidade}, ${store.estado}</p>
                  <p class='institutional__lojas-contato'>${store.contato}</p>
                  <button class='institutional__lojas-mapper' data-name='${_this.string_to_slug(store.nome)}' data-lat='${store.latitude}' data-lng='${store.longitude}'>Ver no mapa</button>
                </li>`
            )
        }
    },

    setFilterStates: function(states) {

        states = states.sort(function(a, b){
            if(a.nome < b.nome) { return -1; }
            if(a.nome > b.nome) { return 1; }
            return 0;
        })


        for (const state of states) {
            $('#state_new').append(`<option value='${state.id}' data-sigla='${state.sigla}'>${state.nome}</option>`)
        }   

        $( "#state_new .lojas-loading-new" ).remove();
        $('#state_new').addClass('active')
    },

    uniq: function(a, param) {
        return a.filter(function(item, pos, array){
            return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
        })
    },

    setFilterCities: function(el) {

        el = el.find(":selected")

        let sigla = el.data('sigla')
        let stores = this.stores.filter(function(store) {return store.estado == sigla})
        stores = this.uniq(stores, 'cidade')

        stores = stores.sort(function(a, b){
            if(a.cidade < b.cidade) { return -1; }
            if(a.cidade > b.cidade) { return 1; }
            return 0;
        })


        $('#city_new').empty()

        if(!stores.length) {
            $('.institutional__lojas-btn').removeClass('active')
            $('#city_new').append(`<option id="lojas-selecione" value="Selecione sua Cidade">Selecione sua Cidade</option>`)
            $('#city_new').removeClass('active')
            return
        }

        for (const store of stores) {
            $('#city_new').append(`<option value='${store.cidade}'>${store.cidade}</option>`)
        }

        $('.institutional__lojas-btn').addClass('active')
        $("#city_new .lojas-loading-new" ).remove();
        $('#city_new').addClass('active')
    },

    initFilters: function(callback) {
        let _this = this

        return _this.getStores()
        .then(function(stores) {
            _this.stores = stores
            return _this.getStates()
        })
        .then(function(states) {
            _this.states =  states.filter(function(state) {
                return _this.stores.find(function(store) {
                    return state.sigla == store.estado
                })
            })
            callback(_this.stores,  _this.states, states)
        })
    },

    getStores: function() {
        let fields = `?_fields=nome,mapa,estado,endereco,contato,cidade,latitude,longitude, `

        return $.ajax ({
            url: `/api/dataentities/NL/search${fields}`,
            headers: {
              "Accept": 'application/vnd.vtex.ds.v10+json',
              "rest-range": "resources=0-999"
            },
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            type: 'GET',
            cache: false
        })
    },

    getStates: function() {
        return $.ajax ({
            url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`,
            type: 'GET',
            cache: false
        })
    }
})