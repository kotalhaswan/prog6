// In App.js in a new project

import * as React from 'react';

import {ThemeProvider} from './ThemeContext';
import NavigationScreen from "./NavigationScreen";


function App() {
// dark mode for the nav bar
    return (
        <ThemeProvider>
        <NavigationScreen>
        </NavigationScreen>
        </ThemeProvider>
    );
}

export default App;