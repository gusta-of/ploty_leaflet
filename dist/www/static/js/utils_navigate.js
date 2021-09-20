function set_baseURL() {

    /**
     * Obtém a base da aplicação apenas para esse cenário estático.
     * Armazena a referencia da base da aplicação na SessionStorage.
     */
    let cont = 0;
    let href_file = window.location.href;
    let href_base = undefined;

    while (true) {

        cont--;
        var sub_string = href_file.slice(cont);

        if (sub_string[0] === '/') {

            href_base = href_file.slice(0, (href_file.length + cont));

            if (!window.sessionStorage.getItem("baseURL")) {
                window.sessionStorage.setItem("baseURL", href_base);
            }

            return
        }

    }
}


function navege(path) {
    window.location.href = window.sessionStorage.getItem("baseURL") + path;
}