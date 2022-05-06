import React, { useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';

//Display the location on the map 
//add a marker to each searched location every time when the location is changed.
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY as string
const Map = (props: { mapCenter: Array<number>, poiList: any, map:any, mapContainer:any }) => {
    const [lng, setLng] = useState(props.mapCenter[1]);
    const [lat, setLat] = useState(props.mapCenter[0]);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
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

        if (props.map.current) return;

        props.map.current = new mapboxgl.Map({
            container: props.mapContainer.current as unknown as HTMLElement,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [114.18, 22.3],
            zoom: zoom
        });
        if (props.poiList.length > 0) {
            console.log('adding...')
        }
    });

    return (
        <div className='map-box'>
            <div ref={props.mapContainer} className="map-container" />
        </div>
    );
}

export default Map;