// In App.js in a new project

import * as React from 'react';
import {View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Places from './Places.js';
import Map from './Map.js';


function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Button
                title="Go to Places"
                onPress={() => navigation.navigate('Places')}
            />
            <Button
                title="Go to Map"
                onPress={() => navigation.navigate('Map')}
            />
        </View>
    );
}

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Places" component={Places}/>
                <Stack.Screen name="Map" component={Map}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;