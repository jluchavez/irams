var map = L.map('map').setView([15.9753, 120.5670], 13);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);

var heat = L.heatLayer(addressPoints, { radius: 50 }).addTo(map);
