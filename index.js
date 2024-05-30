// App.js

import React, { useState, useEffect } from 'react';

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://stud.hosted.hr.nl/1056617/webservice.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);


    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Fetched Data</h1>
                <p>{data.text}</p>
            </header>
        </div>
    );
}

export default App;
