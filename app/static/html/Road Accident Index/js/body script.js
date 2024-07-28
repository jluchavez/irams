        var highlightLayer;
        function highlightFeature(e) {
            highlightLayer = e.target;

            if (e.target.feature.geometry.type === 'LineString') {
              highlightLayer.setStyle({
                color: '#ffff00',
              });
            } else {
              highlightLayer.setStyle({
                fillColor: '#ffff00',
                fillOpacity: 1
              });
            }
        }
        var map = L.map('roadindex-map', {
            zoomControl:true, maxZoom:28, minZoom:1
        }).fitBounds([[15.92635136922692,120.48002771182739],[16.023643050628245,120.64472307010355]]);
        var hash = new L.Hash(map);
        map.attributionControl.setPrefix();
        var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
        function removeEmptyRowsFromPopupContent(content, feature) {
         var tempDiv = document.createElement('div');
         tempDiv.innerHTML = content;
         var rows = tempDiv.querySelectorAll('tr');
         for (var i = 0; i < rows.length; i++) {
             var td = rows[i].querySelector('td.visible-with-data');
             var key = td ? td.id : '';
             if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
                 rows[i].parentNode.removeChild(rows[i]);
             }
         }
         return tempDiv.innerHTML;
        }
        document.querySelector(".leaflet-popup-pane").addEventListener("load", function(event) {
          var tagName = event.target.tagName,
            popup = map._popup;
          // Also check if flag is already set.
          if (tagName === "IMG" && popup && !popup._updated) {
            popup._updated = true; // Set flag to prevent looping.
            popup.update();
          }
        }, true);
        var bounds_group = new L.featureGroup([]);
        function setBounds() {
        }
        function pop_AccidentCounts_0(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
            var popup = layer.getPopup();
            var content = popup.getContent();
            var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
            popup.setContent(updatedContent);
        }

        function style_AccidentCounts_0_0(feature) {
            if (feature.properties['SingleCo_2'] >= 0.000000 && feature.properties['SingleCo_2'] <= 0.000000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(252,187,161,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 0.000000 && feature.properties['SingleCo_2'] <= 1.000000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(252,138,106,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 1.000000 && feature.properties['SingleCo_2'] <= 1.900000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(252,129,97,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 1.900000 && feature.properties['SingleCo_2'] <= 5.200000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(251,121,89,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 5.200000 && feature.properties['SingleCo_2'] <= 6.500000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(251,112,80,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 6.500000 && feature.properties['SingleCo_2'] <= 10.600000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(250,103,72,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 10.600000 && feature.properties['SingleCo_2'] <= 18.000000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(247,92,65,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 18.000000 && feature.properties['SingleCo_2'] <= 28.200000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(245,81,58,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 28.200000 && feature.properties['SingleCo_2'] <= 57.000000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(242,70,51,1.0)',
                interactive: true,
            }
            }
            if (feature.properties['SingleCo_2'] >= 57.000000 && feature.properties['SingleCo_2'] <= 149.000000 ) {
                return {
                pane: 'pane_AccidentCounts_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(238,40,67,1.0)',
                interactive: true,
            }
            }
        }

        // Define the bounds of the map
        var bounds = [[16.0558, 120.3638], [15.8694, 120.7658]];

        // Set maximum bounds to prevent panning outside the bounds
        map.setMaxBounds(bounds);

        map.createPane('pane_AccidentCounts_0');
        map.getPane('pane_AccidentCounts_0').style.zIndex = 400;
        map.getPane('pane_AccidentCounts_0').style['mix-blend-mode'] = 'normal';
        var layer_AccidentCounts_0 = new L.geoJson(json_AccidentCounts_0, {
            attribution: '',
            interactive: true,
            dataVar: 'json_AccidentCounts_0',
            layerName: 'layer_AccidentCounts_0',
            pane: 'pane_AccidentCounts_0',
            onEachFeature: pop_AccidentCounts_0,
            style: style_AccidentCounts_0_0,
        });
        bounds_group.addLayer(layer_AccidentCounts_0);
        map.addLayer(layer_AccidentCounts_0);
        function pop_SingleCoordinate2_1(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (i in e.target._eventParents) {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>\
                    <tr>\
                        <th scope="row">BARANGAY</th>\
                        <td>' + (feature.properties['BARANGAY'] !== null ? autolinker.link(feature.properties['BARANGAY'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
            var popup = layer.getPopup();
            var content = popup.getContent();
            var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
            popup.setContent(updatedContent);
        }

        function style_SingleCoordinate2_1_0() {
            return {
                pane: 'pane_SingleCoordinate2_1',
                radius: 4.0,
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1,
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(232,113,141,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_SingleCoordinate2_1');
        map.getPane('pane_SingleCoordinate2_1').style.zIndex = 401;
        map.getPane('pane_SingleCoordinate2_1').style['mix-blend-mode'] = 'normal';
        var layer_SingleCoordinate2_1 = new L.geoJson(json_SingleCoordinate2_1, {
            attribution: '',
            interactive: true,
            dataVar: 'json_SingleCoordinate2_1',
            layerName: 'layer_SingleCoordinate2_1',
            pane: 'pane_SingleCoordinate2_1',
            onEachFeature: pop_SingleCoordinate2_1,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_SingleCoordinate2_1_0(feature));
            },
        });
        bounds_group.addLayer(layer_SingleCoordinate2_1);
        map.addLayer(layer_SingleCoordinate2_1);
        setBounds();
        var i = 0;
        layer_SingleCoordinate2_1.eachLayer(function(layer) {
            var context = {
                feature: layer.feature,
                variables: {}
            };
            layer.bindTooltip((layer.feature.properties['BARANGAY'] !== null?String('<div style="color: #323232; font-size: 10pt; font-family: \'Open Sans\', sans-serif;">' + layer.feature.properties['BARANGAY']) + '</div>':''), {permanent: true, offset: [-0, -16], className: 'css_SingleCoordinate2_1'});
            labels.push(layer);
            totalMarkers += 1;
              layer.added = true;
              addLabel(layer, i);
              i++;
        });
        map.addControl(new L.Control.Search({
            layer: layer_SingleCoordinate2_1,
            initial: false,
            hideMarkerOnCollapse: true,
            propertyName: 'BARANGAY'}));
        document.getElementsByClassName('search-button')[0].className +=
         ' fa fa-binoculars';
        resetLabels([layer_SingleCoordinate2_1]);
        map.on("zoomend", function(){
            resetLabels([layer_SingleCoordinate2_1]);
        });
        map.on("layeradd", function(){
            resetLabels([layer_SingleCoordinate2_1]);
        });
        map.on("layerremove", function(){
            resetLabels([layer_SingleCoordinate2_1]);
        });