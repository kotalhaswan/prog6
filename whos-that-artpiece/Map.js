// Map.js
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Map({ route }) {
    const initialRegion = {
        latitude: 51.9225, // Latitude of Rotterdam
        longitude: 4.47917, // Longitude of Rotterdam
        latitudeDelta: 0.0922, // Zoom level for latitude
        longitudeDelta: 0.0421, // Zoom level for longitude
    };

    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const mapRef = useRef(null); // Reference to the MapView

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
                if (route.params?.title) {
                    const marker = formattedMarkers.find(m => m.title === route.params.title);
                    setSelectedMarker(marker ? marker.latlng : null);
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
                initialRegion={initialRegion}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {markers.map((marker, index) => (
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
