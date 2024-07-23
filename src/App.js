import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const api = {
  key: "3afab01108f8264cee8ac42f37990279 ",
  base: "https://api.openweathermap.org/data/2.5/",
};  

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [history, setHistory] = useState(true); // Set initial state to true to show the weather search view

  useEffect(() => {
    // Load search history from local storage when the component mounts
    const storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  const saveToLocalStorage = (history) => {
    // Save the search history to local storage
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);

        // Update search history with a new object
        const newSearchHistory = [
          ...searchHistory,
          {
            city: result.name,
            temperature: result.main.temp,
            condition: result.weather[0].main,
            description: result.weather[0].description,
          },
        ];

        setSearchHistory(newSearchHistory);
        saveToLocalStorage(newSearchHistory);
      });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="App">
      <div className='backgroundimg'>
        <header className="weather">
          {history ? (
            <div>
              <h1>Weather App</h1>
              <div className='search mt-3'>
                <input
                  type="text"
                  className='inputfield'
                  placeholder="Enter city/town..."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="responsive-button" onClick={searchPressed}>SEARCH</button>
              </div>
              <div className='winfo'>
                {/* <img src='https://cdn-icons-png.flaticon.com/512/7477/7477790.png'/> */}
              </div>
              {typeof weather.main !== "undefined" ? (
                <div>
                  <ul>  
                    <li>{weather.name}</li>
                    <li>{weather.main.temp}°C</li>
                    <li>{weather.weather[0].main}</li>
                    <li>({weather.weather[0].description})</li>
                  </ul>
                </div>
              ) : (
                ""
              )}
              <button className='checkhistorybtm' onClick={() => setHistory(!history)}>HISTORY</button>
            </div>
          ) : (
            <div>
              {/* Display search history */}
              <div>
                <h2>Search History</h2>
                <ul>
                  {searchHistory.map((item, index) => (
                    <li key={index}>
                      <strong>{item.city}:</strong> {item.temperature}°C, {item.condition} ({item.description})
                    </li>
                  ))}
                </ul>
              </div>
              <button className='searchbtn' onClick={() => setHistory(!history)}>Search Weather</button>
              <button className='claearhistory' onClick={clearHistory}>Clear History</button>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
