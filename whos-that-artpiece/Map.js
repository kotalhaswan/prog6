// Map.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './ThemeContext'; // Import the ThemeContext

export default function Map({ route }) {
    const initialRegion = {
        latitude: 51.9225, // Latitude of Rotterdam
        longitude: 4.47917, // Longitude of Rotterdam
        latitudeDelta: 0.0922, // Zoom level for latitude
        longitudeDelta: 0.0421, // Zoom level for longitude
    };

    const { isDarkMode } = useContext(ThemeContext); // Access the current theme
    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const mapRef = useRef(null); // Reference to the MapView

    const mapStyles = isDarkMode ? darkMapStyle : lightMapStyle;

    //fetches the all the markers locations from the json
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch('https://stud.hosted.hr.nl/1056617/data.json');
                const data = await response.json();
                const formattedMarkers = data.map(item => ({
                    latlng: {
                        latitude: item.latitude,
                        longitude: item.longitude
                    },
                    title: item.title,
                    description: item.description
                }));
                setMarkers(formattedMarkers);
                // this one checks if the selected marker's name is the same as the name you navigated from in Places.JS
                if (route.params?.title) {
                    const marker = formattedMarkers.find(m => m.title === route.params.title);
                    setSelectedMarker(marker ? marker.latlng : null);
                    // if a marker is selected and the user is zoomed out, the map zooms in
                    if (marker) {
                        mapRef.current.animateToRegion({
                            ...marker.latlng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('Error fetching marker data:', error);
            }
        };

        fetchMarkers();
        // loads the favorite markers from Places.js
        const loadFavorites = async () => {
            try {
                const savedFavorites = await AsyncStorage.getItem('favorites');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchMarkers();
        loadFavorites();
    }, [route.params?.title]);

    // asks the user for permission to use their location, then automatically syncs it when approved.
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
        })();
    }, []);
    // zooms in to the selected marker from Places.js
    const handleMarkerPress = (latlng) => {
        setSelectedMarker(latlng);
        mapRef.current.animateToRegion({
            ...latlng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={mapStyles}
                initialRegion={initialRegion}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {markers.map((marker, index) => (
                    // everything underneath here contains:
                    // a section that turns the selected marker from Places.js yellow
                    // a section that opens the info box containing the marker's title and desc if pressed on
                    // a blue marker for the user's current location
                    <Marker
                        key={index}
                        coordinate={marker.latlng}
                        pinColor={
                            marker.latlng.latitude === selectedMarker?.latitude &&
                            marker.latlng.longitude === selectedMarker?.longitude
                                ? 'yellow'
                                : favorites[marker.title] ? 'green' : 'red'
                        }
                        onPress={() => handleMarkerPress(marker.latlng)}
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.title}>{marker.title}</Text>
                                <Text>{marker.description}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        }}
                        title="You are here"
                        pinColor="blue"
                    />
                )}
            </MapView>
            {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    callout: {
        width: 200,
        padding: 5,
    },
    title: {
        fontWeight: 'bold',
    },
    errorMsg: {
        position: 'absolute',
        top: 10,
        width: '100%',
        textAlign: 'center',
        color: 'red',
    },
});

// Define the map styles for dark and light modes
const darkMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

const lightMapStyle = [];
