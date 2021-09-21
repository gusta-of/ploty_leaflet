(function () {
    set_baseURL();

    const form_pesquisa = document.querySelector("#form");
    var state = StackState.get_by_form_id('form');

    if (state) {

        let form_values = StackState.objToDictionary(state.object_reference['form'])
        form_values.forEach((element, i) => {
            for (var atribute in element) {
                form_pesquisa.querySelector("input[name=" + atribute + "]").value = element[atribute] ?? "";
            }
        });
    }

    form_pesquisa.addEventListener('submit', handleSubmit);

    document.querySelector("#navegar").addEventListener('click', (event) => {

        event.preventDefault();
        let data_form = new FormData(form_pesquisa);
        let form_values = Object.fromEntries(data_form);

        StackState.navigate("/proxima.html", { 'form': form_values });
        navege("/proxima.html");
    });
})();

function handleSubmit(e) {
    e.preventDefault()

    const data = new FormData(e.target);
    const values = Object.fromEntries(data);

    axios.get("http://164.90.177.208:2002/service/area/search?param=" + values.local)
        .then((res) => {
            document.querySelector(".result-search").innerHTML = '';
            res.data.forEach((element) => {
                document.querySelector(".result-search").innerHTML +=
                    "<button class='btn-local'  onclick='plotar(" + JSON.stringify(element) + ")'>" + element.display_name + ": " + element.category + "</button>";
            });

        })
        .catch((err) => {
            alert(err);
        });
}

function showPosition(position) {
    console.log(position.coords.latitude, position.coords.longitude)

    var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);


    marker.bindPopup("Você está aqui: " + position.coords.latitude + ", " + position.coords.longitude);
    mymap.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
}

function add_map() {
    L.tileLayer('https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i437142095!3m14!2spt-BR!3sBR!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjMzfHMuZTpsfHAudjpvZmY!4e0!23i1301875', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

}

L.Map.include({
    'clearLayers': function () {
        this.eachLayer(function (layer) {
            this.removeLayer(layer);
        }, this);
    }
});

var mymap = L.map('mapid').setView([40.2288202, -8.4512937], 7);

// Configura evento de click no mapa
mymap.on('click', function (e) {
    const position = e.latlng;
    // clear_map();
    var marker = L.marker([position.lat, position.lng]).addTo(mymap);

    marker.bindPopup("Você está aqui: " + position.lat + ", " + position.lng + "<br><br>"
        + "<a href='#' onclick='cicle(" + JSON.stringify(position) + ")'>circulo</a>");
    mymap.panTo(new L.LatLng(position.lat, position.lng));

    // removeMarker
    marker.on('dbclick', (e) => {
        mymap.removeLayer(marker);
    });
});

function cicle(latlng) {

    var circle = L.circle([latlng.lat, latlng.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: 10000
    }).addTo(mymap);
}

var myLayer = L.geoJSON().addTo(mymap);
add_map();


function clear_map() {
    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });
    add_map();
    myLayer = L.geoJSON().addTo(mymap);
}

document.querySelector('#limpar').addEventListener('click', function (event) {
    clear_map();
    document.querySelector("#form").reset();
    document.querySelector(".result-search").innerHTML = '';
});

const plotar = (element) => {

    switch (element.category) {
        case "boundary": {

            var url = "http://164.90.177.208:2002/service/area/polygon?param=" + element.osm_id
            axios.get(url)
                .then((response) => {

                    clear_map();
                    myLayer = L.geoJSON().addTo(mymap);
                    myLayer.addData(response.data);

                    mymap.panTo(new L.LatLng(element.lat, element.lon));
                })
                .catch((err) => {
                    alert(err);
                    clear_map();
                });

            break;
        }

        default: {

            clear_map();
            var marker = L.marker([element.lat, element.lon]).addTo(mymap);
            // marker.on('mouseover', function (e) {
            //     this.openPopup();
            // });
            // marker.on('mouseout', function (e) {
            //     this.closePopup();
            // });

            marker.bindPopup("<img src=" + element.icon + "><br>" + element.display_name);
            mymap.panTo(new L.LatLng(element.lat, element.lon));
            break;
        }
    }


}
