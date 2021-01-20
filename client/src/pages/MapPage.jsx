import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../components/Spinner';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { USER_ADDRESS_MAP_CONFIRM } from '../constants/userConstants';

const libs = ['places'];
const defaultLocation = { lat: 45.516, lng: -73.56 };

const MapPage = ({ history }) => {
  const dispatch = useDispatch();

  const [GoogleApiKey, setGoogleApiKey] = useState('');
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/config/google');
      setGoogleApiKey(data);
      getUserCurrentLocation();
    };
    fetch();
  }, []);

  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onLoadMarker = (marker) => {
    markerRef.current = marker;
  };
  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onIdle = () => {
    setLocation({ lat: mapRef.current.center.lat(), lng: mapRef.current.center.lng() });
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      alert('Location selected successfully');
      history.push('/shipping');
      dispatch({
        type: USER_ADDRESS_MAP_CONFIRM,
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
    } else {
      alert('Please enter your address');
    }
  };

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  };

  return GoogleApiKey ? (
    <div className='full-container'>
      <LoadScript libraries={libs} googleMapsApiKey={GoogleApiKey}>
        <GoogleMap
          id='sample-map'
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox onLoad={onLoadPlaces} onPlacesChanged={onPlacesChanged}>
            <div className='map-input-box'>
              <input type='text' placeholder='Enter your address' />
              <button type='button' className='primary' onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onLoadMarker}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <Spinner />
  );
};

export default MapPage;
