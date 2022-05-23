mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
projection: 'albers',
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 3.5, // starting zoom
center: [-97, 37] // starting center
});

map.setProjection("albers");

const grades = [10, 50, 100, 150, 200, 250, 300, 350],
colors = ['rgb(255,255,168)', 'rgb(255,233,137)', 'rgb(254,214,108)', 'rgb(254,179,79)', 'rgb(253,146,68)', 'rgb(252,89,56)', 'rgb(232,50,52)', 'rgb(255,80,118)']
radii = [7, 7, 7, 7, 7, 7, 7, 7];

//load data to the map as new layers.
//map.on('load', function loadingData() {
    map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

        // when loading a geojson, there are two steps
        // add a source of the data and then add the layer out of the source
        map.addSource('covid', {
            type: 'geojson',
            data: 'assets/us-covid-2020-rates.json'
        });

        map.addLayer({
            'id': 'covid-point',
            'type': 'fill',
            'source': 'covid',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0',   // stop_output_0
                    10,          // stop_input_0
                    '#FED976',   // stop_output_1
                    20,          // stop_input_1
                    '#FEB24C',   // stop_output_2
                    50,          // stop_input_2
                    '#FD8D3C',   // stop_output_3
                    100,         // stop_input_3
                    '#FC4E2A',   // stop_output_4
                    200,         // stop_input_4
                    '#E31A1C',   // stop_output_5
                    500,         // stop_input_5
                    '#BD0026',   // stop_output_6
                    1000,        // stop_input_6
                    "#800026"    // stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
        // click on tree to view magnitude in a popup
        map.on('click', 'covid-point', (e) => {
            new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Rate:</strong> ${e.features[0].properties.rates} <br> <strong>State:</strong> ${e.features[0].properties.state} <br> <strong>County:</strong> ${e.features[0].properties.county}`)
            .addTo(map);
        });

        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        map.on('mouseenter', 'covid-point', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'covid-point', () => {
            map.getCanvas().style.cursor = '';
        });
    });

            // create legend
            const legend = document.getElementById('legend');

            //set up legend grades and labels
            var labels = ['<strong>Cases</strong>'], vbreak;
            //iterate through grades and create a scaled circle and label for each
            for (var i = 0; i < grades.length; i++) {
                vbreak = grades[i];
                // you need to manually adjust the radius of each dot on the legend 
                // in order to make sure the legend can be properly referred to the dot on the map.
                dot_radii = 2 * radii[i];
                labels.push(
                    '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
                    'px; height: ' +
                    dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
                    '</span></p>');
    
            }
            // add the data source
            const source =
                '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.census.gov/cedsci/table?g=0100000US%24050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">United States Census Bureau</a></p>';
            // combine all the html codes.
            legend.innerHTML = labels.join('') + source;