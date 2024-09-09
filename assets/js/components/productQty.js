APP.component.productQty = VtexClass.extend({
    // init
    init(element) {
        this.element = element;

        if (this.element instanceof Object) {
            this.skuProduct(this.element);
        }
    },



    // sku find
    findAvailability(size) {
        let newArr = skuJson_0.skus.filter((item)=>{ return item.skuname === size});
        return newArr[0].availablequantity;
        // return check;
    },


    // sku product
    skuProduct(dimension) {
        let _that = this;
        let label = $(dimension).find('.group_0 label');
        $(label).each(function (index) {
            console.log('[ LABEL ]', $(this).html());
            let size =$(this).html();
            $(this).attr('data-availability', _that.findAvailability(size).toString());
            console.log('_that.findAvailability(size)',_that.findAvailability(size).toString());
        });

    }
})
