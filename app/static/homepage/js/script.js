     var highlightLayer;
        function highlightFeature(e) {
            highlightLayer = e.target;

            if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
              highlightLayer.setStyle({
                color: '#ffff00',
              });
            } else {
              highlightLayer.setStyle({
                fillColor: '#ffff00',
                fillOpacity: 1
              });
            }
            highlightLayer.openPopup();
        }
        var map = L.map('urdaneta-map', {
            zoomControl:true, maxZoom:28, minZoom:1
        }).fitBounds([[15.903507485389062,120.4316256263126],[16.067238950906596,120.69752552631307]]);
        var hash = new L.Hash(map);
        map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
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
        map.createPane('pane_GoogleSatellite_0');
        map.getPane('pane_GoogleSatellite_0').style.zIndex = 400;
        var layer_GoogleSatellite_0 = L.tileLayer('https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
            pane: 'pane_GoogleSatellite_0',
            opacity: 1.0,
            attribution: '',
            minZoom: 1,
            maxZoom: 28,
            minNativeZoom: 0,
            maxNativeZoom: 18
        });
        layer_GoogleSatellite_0;
        map.addLayer(layer_GoogleSatellite_0);
        function pop_Barangaycopy_1(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (var i in e.target._eventParents) {
                        if (typeof e.target._eventParents[i].resetStyle === 'function') {
                            e.target._eventParents[i].resetStyle(e.target);
                        }
                    }
                    if (typeof layer.closePopup == 'function') {
                        layer.closePopup();
                    } else {
                        layer.eachLayer(function(feature){
                            feature.closePopup()
                        });
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

        function style_Barangaycopy_1_0() {
            return {
                pane: 'pane_Barangaycopy_1',
                opacity: 1,
                color: 'rgba(246,26,26,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(213,180,60,0.0)',
                interactive: false,
            }
        }
        map.createPane('pane_Barangaycopy_1');
        map.getPane('pane_Barangaycopy_1').style.zIndex = 401;
        map.getPane('pane_Barangaycopy_1').style['mix-blend-mode'] = 'normal';
        var layer_Barangaycopy_1 = new L.geoJson(json_Barangaycopy_1, {
            attribution: '',
            interactive: false,
            dataVar: 'json_Barangaycopy_1',
            layerName: 'layer_Barangaycopy_1',
            pane: 'pane_Barangaycopy_1',
            onEachFeature: pop_Barangaycopy_1,
            style: style_Barangaycopy_1_0,
        });
        bounds_group.addLayer(layer_Barangaycopy_1);
        map.addLayer(layer_Barangaycopy_1);
        function pop_SingleCoordinate2_2(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (var i in e.target._eventParents) {
                        if (typeof e.target._eventParents[i].resetStyle === 'function') {
                            e.target._eventParents[i].resetStyle(e.target);
                        }
                    }
                    if (typeof layer.closePopup == 'function') {
                        layer.closePopup();
                    } else {
                        layer.eachLayer(function(feature){
                            feature.closePopup()
                        });
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>\
                    <tr>\
                        <th scope="row">BARANGAY</th>\
                        <td>' + (feature.properties['BARANGAY'] !== null ? autolinker.link(feature.properties['BARANGAY'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">ISLAND GROUP</th>\
                        <td>' + (feature.properties['ISLAND GROUP'] !== null ? autolinker.link(feature.properties['ISLAND GROUP'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">REGION</th>\
                        <td>' + (feature.properties['REGION'] !== null ? autolinker.link(feature.properties['REGION'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">PROVINCE</th>\
                        <td>' + (feature.properties['PROVINCE'] !== null ? autolinker.link(feature.properties['PROVINCE'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">CITY</th>\
                        <td>' + (feature.properties['CITY'] !== null ? autolinker.link(feature.properties['CITY'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">POSTAL CODE</th>\
                        <td>' + (feature.properties['POSTAL CODE'] !== null ? autolinker.link(feature.properties['POSTAL CODE'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">POPULATION</th>\
                        <td>' + (feature.properties['POPULATION'] !== null ? autolinker.link(feature.properties['POPULATION'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['COORDINATES'] !== null ? autolinker.link(feature.properties['COORDINATES'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <th scope="row">ESTIMATED ELEVATION ABOVE SEA LEVEL</th>\
                        <td>' + (feature.properties['ESTIMATED ELEVATION ABOVE SEA LEVEL'] !== null ? autolinker.link(feature.properties['ESTIMATED ELEVATION ABOVE SEA LEVEL'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
            var popup = layer.getPopup();
            var content = popup.getContent();
            var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
            popup.setContent(updatedContent);
        }

        function style_SingleCoordinate2_2_0() {
            return {
                pane: 'pane_SingleCoordinate2_2',
                radius: 4.0,
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1,
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(163,251,10,1.0)',
                interactive: true,
            }
        }
        map.createPane('pane_SingleCoordinate2_2');
        map.getPane('pane_SingleCoordinate2_2').style.zIndex = 402;
        map.getPane('pane_SingleCoordinate2_2').style['mix-blend-mode'] = 'normal';
        var layer_SingleCoordinate2_2 = new L.geoJson(json_SingleCoordinate2_2, {
            attribution: '',
            interactive: true,
            dataVar: 'json_SingleCoordinate2_2',
            layerName: 'layer_SingleCoordinate2_2',
            pane: 'pane_SingleCoordinate2_2',
            onEachFeature: pop_SingleCoordinate2_2,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_SingleCoordinate2_2_0(feature));
            },
        });
        bounds_group.addLayer(layer_SingleCoordinate2_2);
        map.addLayer(layer_SingleCoordinate2_2);
        setBounds();
        var i = 0;
        layer_SingleCoordinate2_2.eachLayer(function(layer) {
            var context = {
                feature: layer.feature,
                variables: {}
            };
            layer.bindTooltip((layer.feature.properties['BARANGAY'] !== null?String('<div style="color: #ffffff; font-size: 10pt; font-family: \'Open Sans\', sans-serif;">' + layer.feature.properties['BARANGAY']) + '</div>':''), {permanent: true, offset: [-0, -16], className: 'css_SingleCoordinate2_2'});
            labels.push(layer);
            totalMarkers += 1;
              layer.added = true;
              addLabel(layer, i);
              i++;
        });
        map.addControl(new L.Control.Search({
            layer: layer_SingleCoordinate2_2,
            initial: false,
            hideMarkerOnCollapse: true,
            propertyName: 'BARANGAY'}));
        document.getElementsByClassName('search-button')[0].className +=
         ' fa fa-binoculars';
        resetLabels([layer_SingleCoordinate2_2]);
        map.on("zoomend", function(){
            resetLabels([layer_SingleCoordinate2_2]);
        });
        map.on("layeradd", function(){
            resetLabels([layer_SingleCoordinate2_2]);
        });
        map.on("layerremove", function(){
            resetLabels([layer_SingleCoordinate2_2]);
        });