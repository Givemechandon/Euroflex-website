APP.component.helpers = VtexClass.extend({

    init: function (options) {
        this.setup(options)
        this.start()
        this.bind()
    },

    start: function () {

        $('.helpers').fadeIn("slow")

        $('body').on('click', '.btn-chat', function(e) {
            e.preventDefault()
            $('.helpers__content-subItem').toggleClass("active");
        })
    },

    setup: function (options) {
    },


    bind: function () {
    }
})