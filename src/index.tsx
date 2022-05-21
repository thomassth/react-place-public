import React, { useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import './styles/index.css';
import Map from './components/Map';
import { SearchBar } from './components/SearchBar';
import PoiList from './components/PoiList';
import { Poi } from './components/Poi';
import { Timezone } from './components/Timezone';
import { Clock } from './components/Clock';
import useLocalStorage from './features/useLocalStorage'
initializeIcons();

function errLog(error: GeolocationPositionError) {
  console.warn(`Error code ${error.code}: ${error.message}`)
}

const Container = () => {
  const [mapCenter, setMapCenter] = useState<number[]>([]);
  const [selectedBox, setSelectedBox] = useState<number[]>([])
  const [timeOffset, setTimeOffset] = useState<number[]>([])
  const [utcOffsetSec, setUtcOffsetSec] = useState(0)
  const [poiList, setPoiList] = useLocalStorage<Poi[]>('poiList', [])
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);

  //A checkbox at the beginning of each row to allow user to select multiple records at the same time.
  //A delete button on the top of it to delete all selected records as well as the marker on the map.

  //Display the time zone and local time of the latest searched location.

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addNewCrd([position.coords.longitude, position.coords.latitude])
      }, errLog)
  }

  function searchBoxGeocoding(search_text: string) {
    let center: [number, number] = [0, 0]
    if (search_text.length > 0)
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?limit=1&access_token=pk.eyJ1IjoidGhvbWFzc3RoIiwiYSI6ImNreTRsZDcyYTA4cDQyd3BseWsyYThwb2kifQ.eqXVOv4PXnYh4DkwffasIQ`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      })
        .then(response => response.json())
        .then(data => {
          center = data.features[0].center
          const name = data.features[0].place_name
          addNewCrd(center, name)
        })
  }

  function onCrdChanged(newCrd: number[]) {
    setMapCenter(newCrd)
  }

  function changeSelectedBox(number: number, arg: string) {
    let currentSelectedBox = selectedBox
    if (arg === 'minus') {
      setSelectedBox(currentSelectedBox.splice(currentSelectedBox.indexOf(number)))
    } else if (!selectedBox.includes(number)) {
      currentSelectedBox.push(number)
      setSelectedBox(currentSelectedBox.sort())
    }
  }

  function deleteSelected() {
    const currentSelectedBox = selectedBox.reverse()
    let currentPoiList =
      poiList
    currentSelectedBox.forEach((element: number) => {
      currentPoiList.splice(element - 1, 1)
    });
    setSelectedBox([])
    setPoiList(currentPoiList)
    reloadMapLayer()
  }

  function setUtcSec(input: number) {
    setUtcOffsetSec(input)
  }

  function addNewCrd(newCrd: [number, number], name = 'current location') {
    let shouldAdd = true
    const newList: Poi[] = poiList
    newList.forEach(element => {
      if (element.geometry.coordinates[0] === newCrd[0] && element.geometry.coordinates[1] === newCrd[1]) {
        shouldAdd = false
      }
    });
    if (shouldAdd) {
      newList.push(new Poi(poiList.length + 1, name, newCrd))
      setPoiList(newList)
    }
    onCrdChanged(newCrd)
    reloadMapLayer()
  }

  function reloadMapLayer() {
    const stores = {
      'type': 'FeatureCollection',
      'features': poiList
    }

    if (map.current != null) {
      let currentMap = map.current
      if (map.current.getLayer('locations')) {
        map.current.removeLayer('locations')
      }
      if (currentMap.getSource('locations')) {
        currentMap.removeSource('locations');
      }
      map.current.addLayer({
        id: 'locations',
        type: 'circle',
        paint: {
          "circle-radius": 10,
          'circle-color': 'lightblue',
        },
        source: {
          type: 'geojson',
          data: stores as unknown as string
        }
      });

    }

  }

  function changeOffset(offset: []) {
    setTimeOffset(offset)
  }

  return (
    <div className="container">
      <div className='main'>
        <SearchBar
          getLoc={getCurrentLocation}
          getGeocode={searchBoxGeocoding}
        />
        <Timezone
          mapCenter={mapCenter}
          changeOffset={changeOffset}
        />
        <Clock
          mapCenter={mapCenter}
          timeOffset={timeOffset}
          setUtcSec={setUtcSec}
          utcOffsetSec={utcOffsetSec}
        />
        <Map
          mapCenter={mapCenter}
          poiList={poiList}
          map={map}
          mapContainer={mapContainer}
        />
      </div>
      {/* A table with pagination to show all searched places: */}
      {/* It displays a maximum of 10 records on each page. */}
      <div className='side'>
        <PoiList
          onCrdChanged={onCrdChanged}
          poiList={poiList}
          changeSelectedBox={changeSelectedBox}
          deleteSelected={deleteSelected}
        />
      </div>
    </div>
  );
}

// ========================================

const root = createRoot(document.getElementById("root")!);
root.render(<React.StrictMode>
  <Container />
</React.StrictMode>);

