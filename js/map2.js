mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
projection: 'albers',
style: 'mapbox://styles/mapbox/navigation-night-v1',
zoom: 3.5, // starting zoom
center: [-97, 37] // starting center
});

map.setProjection("albers");

const grades = [1000, 3000, 5000, 7000, 9000, 11000, 13000, 15000]
colors = ['rgb(252,251,253)', 'rgb(239,237,245)', 'rgb(218,218,235)', 'rgb(188,189,220)', 'rgb(158,154,200)', 'rgb(128,125,186)', 'rgb(106,81,163)', 'rgb(84,39,143)'],
radii = [2, 4, 6, 8, 10, 12, 14, 16];

//load data to the map as new layers.
//map.on('load', function loadingData() {
    map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

        // when loading a geojson, there are two steps
        // add a source of the data and then add the layer out of the source
        map.addSource('covid', {
            type: 'geojson',
            data: 'assets/us-covid-2020-counts.json'
        });

        map.addLayer({
            'id': 'covid-point',
            'type': 'circle',
            'source': 'covid',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 4,
                            value: grades[0]
                        }, radii[0]],
                        [{
                            zoom: 4,
                            value: grades[1]
                        }, radii[1]],
                        [{
                            zoom: 4,
                            value: grades[2]
                        }, radii[2]],
                        [{
                            zoom: 4,
                            value: grades[3]
                        }, radii[3]],
                        [{
                            zoom: 4,
                            value: grades[4]
                        }, radii[4]],
                        [{
                            zoom: 4,
                            value: grades[5]
                        }, radii[5]],
                        [{
                            zoom: 4,
                            value: grades[6]
                        }, radii[6]],
                        [{
                            zoom: 4,
                            value: grades[7]
                        }, radii[7]]
                        
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]],
                        [grades[4], colors[4]],
                        [grades[5], colors[5]],
                        [grades[6], colors[6]],
                        [grades[7], colors[7]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
        'waterway-label'
        );
        // click on tree to view magnitude in a popup
        map.on('click', 'covid-point', (event) => {
            new mapboxgl.Popup()
                .setLngLat(event.features[0].geometry.coordinates)
                .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases} <br> <strong>Deaths:</strong> ${event.features[0].properties.deaths} <br> <strong>State:</strong> ${event.features[0].properties.state} <br> <strong>County:</strong> ${event.features[0].properties.county}`)
                .addTo(map);
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
                '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYT</a></p>';
            // combine all the html codes.
            legend.innerHTML = labels.join('') + source;