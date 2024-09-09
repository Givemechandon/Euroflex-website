function isStable() {
    var isStable = '';
    var site = "eurocolchoes";
    var stable = 'myvtex';
    var url = window.location.hostname; // obter o dominio
    var url_splt = url.split('.')
    var url_name = url_splt[url_splt.length - 2];
    if (url_name == stable) {
        isStable = true;
    } else if (url_name == site){
        isStable = false;
    }
    


    if (isStable) {
       // stable
    } else {
        $('body').addClass('prod');
    }

}
isStable()
