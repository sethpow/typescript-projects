"use strict";
const form = document.querySelector('form');
function searchAddressHandler(event) {
    event.preventDefault();
    const coordinates = { lat: 40.41, lng: -73.99 };
    document.getElementById('map').innerHTML = '';
    new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([coordinates.lng, coordinates.lat]),
            zoom: 16
        })
    });
}
form.addEventListener('submit', searchAddressHandler);
//# sourceMappingURL=app.js.map