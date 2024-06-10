import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';

export default function Map() {
    const initialRegion = {
        latitude: 51.9225, // Latitude of Rotterdam
        longitude: 4.47917, // Longitude of Rotterdam
        latitudeDelta: 0.0922, // Zoom level for latitude
        longitudeDelta: 0.0421, // Zoom level for longitude
    };

    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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
            } catch (error) {
                console.error('Error fetching marker data:', error);
            }
        };

        fetchMarkers();
    }, []);

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

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true} // Show user's location on the map
                followsUserLocation={true} // Follow user's location on the map
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker.latlng}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        }}
                        title="You are here"
                        pinColor="blue" // Customize marker color
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
    errorMsg: {
        position: 'absolute',
        top: 10,
        width: '100%',
        textAlign: 'center',
        color: 'red',
    },
});
