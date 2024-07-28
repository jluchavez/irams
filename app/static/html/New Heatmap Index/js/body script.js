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
        }
        var map = L.map('index-map', {
            zoomControl:true, maxZoom:20, minZoom:1
        }).fitBounds([[15.88713264194086,120.40457614374999],[16.089959437847465,120.73396686030232]]);
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
        function pop_PHL_adm2_0(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (var i in e.target._eventParents) {
                        if (typeof e.target._eventParents[i].resetStyle === 'function') {
                            e.target._eventParents[i].resetStyle(e.target);
                        }
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['ID_0'] !== null ? autolinker.link(feature.properties['ID_0'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['ISO'] !== null ? autolinker.link(feature.properties['ISO'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['NAME_0'] !== null ? autolinker.link(feature.properties['NAME_0'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['ID_1'] !== null ? autolinker.link(feature.properties['ID_1'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['NAME_1'] !== null ? autolinker.link(feature.properties['NAME_1'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['ID_2'] !== null ? autolinker.link(feature.properties['ID_2'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['NAME_2'] !== null ? autolinker.link(feature.properties['NAME_2'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['TYPE_2'] !== null ? autolinker.link(feature.properties['TYPE_2'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['ENGTYPE_2'] !== null ? autolinker.link(feature.properties['ENGTYPE_2'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['NL_NAME_2'] !== null ? autolinker.link(feature.properties['NL_NAME_2'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['VARNAME_2'] !== null ? autolinker.link(feature.properties['VARNAME_2'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
            var popup = layer.getPopup();
            var content = popup.getContent();
            var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
            popup.setContent(updatedContent);
        }

        function style_PHL_adm2_0_0() {
            return {
                pane: 'pane_PHL_adm2_0',
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0,
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(27,214,247,1.0)',
                interactive: false,
            }
        }
        map.createPane('pane_PHL_adm2_0');
        map.getPane('pane_PHL_adm2_0').style.zIndex = 400;
        map.getPane('pane_PHL_adm2_0').style['mix-blend-mode'] = 'normal';
        var layer_PHL_adm2_0 = new L.geoJson(json_PHL_adm2_0, {
            attribution: '',
            interactive: false,
            dataVar: 'json_PHL_adm2_0',
            layerName: 'layer_PHL_adm2_0',
            pane: 'pane_PHL_adm2_0',
            onEachFeature: pop_PHL_adm2_0,
            style: style_PHL_adm2_0_0,
        });
        bounds_group.addLayer(layer_PHL_adm2_0);
        map.addLayer(layer_PHL_adm2_0);
        function pop_AccidentCounts_1(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (var i in e.target._eventParents) {
                        if (typeof e.target._eventParents[i].resetStyle === 'function') {
                            e.target._eventParents[i].resetStyle(e.target);
                        }
                    }
                },
                mouseover: highlightFeature,
            });
            var popupContent = '<table>
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
            var popup = layer.getPopup();
            var content = popup.getContent();
            var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
            popup.setContent(updatedContent);
        }

        function style_AccidentCounts_1_0(feature) {
            if (feature.properties['SingleCo_2'] >= 0.000000 && feature.properties['SingleCo_2'] <= 0.000000 ) {
                return {
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
                pane: 'pane_AccidentCounts_1',
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
        map.createPane('pane_AccidentCounts_1');
        map.getPane('pane_AccidentCounts_1').style.zIndex = 401;
        map.getPane('pane_AccidentCounts_1').style['mix-blend-mode'] = 'normal';
        var layer_AccidentCounts_1 = new L.geoJson(json_AccidentCounts_1, {
            attribution: '',
            interactive: true,
            dataVar: 'json_AccidentCounts_1',
            layerName: 'layer_AccidentCounts_1',
            pane: 'pane_AccidentCounts_1',
            onEachFeature: pop_AccidentCounts_1,
            style: style_AccidentCounts_1_0,
        });
        bounds_group.addLayer(layer_AccidentCounts_1);
        map.addLayer(layer_AccidentCounts_1);
        function pop_SingleCoordinate2_2(feature, layer) {
            layer.on({
                mouseout: function(e) {
                    for (var i in e.target._eventParents) {
                        if (typeof e.target._eventParents[i].resetStyle === 'function') {
                            e.target._eventParents[i].resetStyle(e.target);
                        }
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
                        <th scope="row">CITY</th>\
                        <td>' + (feature.properties['CITY'] !== null ? autolinker.link(feature.properties['CITY'].toLocaleString()) : '') + '</td>\
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
                fillColor: 'rgba(232,113,141,1.0)',
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
            layer.bindTooltip((layer.feature.properties['BARANGAY'] !== null?String('<div style="color: #323232; font-size: 10pt; font-family: \'Open Sans\', sans-serif;">' + layer.feature.properties['BARANGAY']) + '</div>':''), {permanent: true, offset: [-0, -16], className: 'css_SingleCoordinate2_2'});
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