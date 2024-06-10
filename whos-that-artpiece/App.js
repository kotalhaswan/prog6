// In App.js in a new project

import * as React from 'react';

import {ThemeProvider} from './ThemeContext';
import NavigationScreen from "./NavigationScreen";


function App() {

    return (
        <ThemeProvider>
        <NavigationScreen>
        </NavigationScreen>
        </ThemeProvider>
    );
}

export default App;