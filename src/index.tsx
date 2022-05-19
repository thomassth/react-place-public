import React from 'react';
import mapboxgl from 'mapbox-gl';
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

initializeIcons();

function errLog(error: GeolocationPositionError) {
  console.warn(`Error code ${error.code}: ${error.message}`)
}


class Container extends React.Component<{}, {
  mapCenter: Array<number>,
  poiList: Array<Poi>,
  selectedBox: Array<number>,
  markerList: Array<any>,
  timeOffset: Array<number>,
  utcOffsetSec: number

}> {
  mapContainer: React.RefObject<unknown>;
  map: React.RefObject<mapboxgl.Map | null>;
  constructor(props: { crdSaved: GeolocationCoordinates }) {
    super(props);
    this.state = {
      mapCenter: [],
      poiList: [],
      selectedBox: [],
      markerList: [],
      timeOffset: [],
      utcOffsetSec: 0
      // {latitude: 22.30,longitude:114.18,altitude: 7,accuracy: 21, altitudeAccuracy: 8.31, heading: null, speed: null } 
    };
    this.mapContainer = React.createRef();
    this.map = React.createRef()
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.addNewCrd([position.coords.longitude, position.coords.latitude])
      }, errLog)
  }

  searchBoxGeocoding = (search_text: string) => {
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
          this.addNewCrd(center, name)
        })
  }



  onCrdChanged = (newCrd: Array<number>) => {
    this.setState({
      mapCenter: newCrd
    })
  }

  changeSelectedBox = (number: number, arg: string) => {
    let selectedBox = this.state.selectedBox
    if (arg === 'minus') {
      this.setState({
        selectedBox: selectedBox.splice(selectedBox.indexOf(number))
      })
    } else if (!this.state.selectedBox.includes(number)) {
      selectedBox.push(number)
      this.setState({
        selectedBox: selectedBox.sort()
      })
    }
  }

  deleteSelected = () => {
    const selectedBox = this.state.selectedBox.reverse()
    let poiList = this.state.poiList
    selectedBox.forEach(element => {
      console.log(element)
      poiList.splice(element - 1, 1)
    });
    this.setState({
      selectedBox: [],
      poiList: poiList
    })
    this.reloadMapLayer()
  }

  setUtcSec = (input: number) => {
    this.setState({
      utcOffsetSec: input
    })
  }

  addNewCrd = (newCrd: [number, number], name = 'current location') => {
    let shouldAdd = true
    const newList = this.state.poiList
    newList.forEach(element => {
      if (element.center[0] === newCrd[0] && element.center[1] === newCrd[1]) {
        shouldAdd = false
      }
    });
    if (shouldAdd) {
      newList.push(new Poi(this.state.poiList.length + 1, name, newCrd))
      this.setState({
        poiList: newList
      })
    }
    this.onCrdChanged(newCrd)
    this.reloadMapLayer()
  }

  reloadMapLayer() {
    const stores = {
      'type': 'FeatureCollection',
      'features': this.state.poiList
    }

    if (this.map.current != null) {
      let map = this.map.current
      if (this.map.current.getLayer('locations')) {
        this.map.current.removeLayer('locations')
        console.log('removed')
      }
      if (map.getSource('locations')) {
        map.removeSource('locations');
      }
      this.map.current.addLayer({
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

  changeOffset = (offset: []) => {
    this.setState({
      timeOffset: offset
    })
  }

  render() {
    const mapCenter = this.state.mapCenter
    const poiList = this.state.poiList
    return (
      <div className="container">
        <div className='main'>
          <SearchBar
            getLoc={this.getCurrentLocation}
            getGeocode={this.searchBoxGeocoding}
          />
          <Timezone
            mapCenter={mapCenter}
            changeOffset={this.changeOffset}
          />
          <Clock
            mapCenter={mapCenter}
            timeOffset={this.state.timeOffset}
            setUtcSec={this.setUtcSec}
            utcOffsetSec={this.state.utcOffsetSec}
          />
          <Map
            mapCenter={mapCenter}
            poiList={poiList}
            map={this.map}
            mapContainer={this.mapContainer}
          />
        </div>
        {/* A table with pagination to show all searched places: */}
        {/* It displays a maximum of 10 records on each page. */}
        <div className='side'>
          <PoiList
            onCrdChanged={this.onCrdChanged}
            poiList={poiList}
            changeSelectedBox={this.changeSelectedBox}
            deleteSelected={this.deleteSelected}
          />
        </div>
      </div>
    );
  }
}

// ========================================

const root = createRoot(document.getElementById("root")!);
root.render(<React.StrictMode>
  <Container />
</React.StrictMode>);

