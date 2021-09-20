class StackState {

    static navigate(path, object_reference) {

        var aux_states = this.get_all();

        var possui_estado_gravado = aux_states.map((o) => o.path === path);

        if (possui_estado_gravado[0]) {

            aux_states.forEach((e, i) => {
                if (e.path === path) {
                    e.object_reference = object_reference;
                }
            });

            this.__grave(aux_states);
            return
        }


        var params = { path, object_reference }

        aux_states.push(params);
        this.__grave(aux_states);

    }

    static pop() {
        var aux_state = this.get_all();
        aux_state.pop();

        this.__grave(aux_states);
    }

    static get_all() {
        var array_states = !window.sessionStorage.getItem("forms") ?
            undefined :
            window.sessionStorage.getItem("forms").split("|");

        if (array_states)
            array_states.forEach((e, i) => array_states[i] = JSON.parse(e));

        return array_states ?? [];
    }

    static get_by_form_id(id) {
        var all_values = this.get_all();
        var obj = all_values.find((o) => o.object_reference[id]);

        return obj
    }

    static __grave(array) {
        array.forEach((e, i) => array[i] = JSON.stringify(e));
        var states = array.join("|");

        window.sessionStorage.setItem("forms", states);
    }

    static objToDictionary(obj) {
        return Object.keys(obj).map(k => ({ [k]: obj[k] }));
    }
}