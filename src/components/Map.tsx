import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Poi } from './Poi';

//Display the location on the map 
//add a marker to each searched location every time when the location is changed.
mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzc3RoIiwiYSI6ImNreTRsZDcyYTA4cDQyd3BseWsyYThwb2kifQ.eqXVOv4PXnYh4DkwffasIQ';
const Map = (props: { mapCenter: Array<number>, map: any, mapContainer: any, poiList: Poi[] }) => {
    const [lng, setLng] = useState(props.mapCenter[1]);
    const [lat, setLat] = useState(props.mapCenter[0]);
    const [zoom, setZoom] = useState(11);

    useEffect(() => {
        //Fly to new location per new crd
        if (lng !== props.mapCenter[1] || lat !== props.mapCenter[0]) {
            const newLng = props.mapCenter[1]
            const newLat = props.mapCenter[0]
            if (props.map.current != null) {
                props.map.current.flyTo({
                    center: [newLat, newLng],
                    essential: true
                })
            }
        }

        if (props.map.current) return; // initialize map only once

        props.map.current = new mapboxgl.Map({
            container: props.mapContainer.current as unknown as HTMLElement,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [114.18, 22.3],
            zoom: zoom
        });
        if (props.poiList.length !== 0) {
            props.map.current.on('load', () => {
                const stores = {
                    'type': 'FeatureCollection',
                    'features': props.poiList
                }
                props.map.current.addSource('locations', {
                    type: 'geojson',
                    data: stores as unknown as string
                })

                props.map.current.addLayer({
                    id: 'locations',
                    type: 'circle',
                    paint: {
                        "circle-radius": 10,
                        'circle-color': 'lightblue',
                    },
                    source: 'locations'
                });
            })
        }
    });

    return (
        <div className='map-box'>
            <div ref={props.mapContainer} className="map-container" />
        </div>
    );
}

export default Map;