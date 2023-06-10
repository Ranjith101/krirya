import React, { useState, useEffect } from 'react';

function Covid_History() {
  const [continents, setContinents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedContinent, setExpandedContinent] = useState(null);
  const [searchCountry, setSearchCountry] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);

  useEffect(() => {
    fetchContinentsData();
  }, []);

  const fetchContinentsData = async () => {
    const url = 'https://covid-193.p.rapidapi.com/statistics';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '44fb1481dcmshd787b6591392e15p1bd237jsn9e13fa8cc045',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      console.log(data); // Check the structure of the received data
  
      if (data && data.response && Array.isArray(data.response)) {
        const continentsData = [];
        const countriesData = {};
  
        // Extract country data from each continent
        data.response.forEach((continent) => {
          const continentName = continent.continent;
  
          if (continent.countries && Array.isArray(continent.countries)) {
            continent.countries.forEach((country) => {
              const countryName = country.country;
  
              // Create an object for the country if it doesn't exist
              if (!countriesData[countryName]) {
                countriesData[countryName] = {
                  name: countryName,
                  population: country.population,
                  covidCases: country.cases.total
                };
              }
            });
          }
  
          // Create an object for the continent and add countries to it
          continentsData.push({
            name: continentName,
            countries: Object.values(countriesData)
          });
        });
  
        setContinents(continentsData);
      } else {
        console.log('Invalid data structure:', data);
      }
  
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchCountryHistory = async (countryName) => {
    const url = `https://covid-193.p.rapidapi.com/history?country=${countryName}&day=2020-06-02`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '44fb1481dcmshd787b6591392e15p1bd237jsn9e13fa8cc045',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data && data.response && Array.isArray(data.response)) {
        const countryData = data.response[0]; // Assuming only one data entry is returned

        const newCases = countryData.cases.new !== null ? countryData.cases.new : 'N/A';
        const deaths = countryData.deaths.total !== null ? countryData.deaths.total : 'N/A';

        setCountryDetails((prevDetails) => ({
          ...prevDetails,
          newCases: newCases,
          deaths: deaths
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

 
  const handleSearchCountry = async (event) => {
    const countryName = event.target.value;
    setSearchCountry(countryName);

    const foundCountry = continents
      .flatMap((continent) => continent.countries)
      .find((country) => country.name.toLowerCase() === countryName.toLowerCase());

    setCountryDetails(foundCountry);

    if (foundCountry) {
      fetchCountryHistory(foundCountry.name);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  const handleExpandContinent = async (continentName) => {
    if (expandedContinent === continentName) {
      setExpandedContinent(null);
    } else {
      setExpandedContinent(continentName);
      const continent = continents.find((c) => c.name === continentName);
  
      if (continent) {
        const countries = continent.countries;
  
        // Fetch country data for all countries in the continent
        const updatedCountries = await Promise.all(
          countries.map(async (country) => {
            const countryData = await fetchCountryData(country.name);
            return {
              ...country,
              covidCases: countryData.cases.total,
              deaths: countryData.deaths.total
            };
          })
        );
  
        setContinents((prevContinents) => {
          const updatedContinents = prevContinents.map((c) => {
            if (c.name === continentName) {
              return {
                ...c,
                countries: updatedCountries
              };
            }
            return c;
          });
          return updatedContinents;
        });
      }
    }
  };
  
  const fetchCountryData = async (countryName) => {
    const url = `https://covid-193.p.rapidapi.com/statistics?country=${countryName}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '44fb1481dcmshd787b6591392e15p1bd237jsn9e13fa8cc045',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      if (data && data.response && Array.isArray(data.response)) {
        return data.response[0];
      }
    } catch (error) {
      console.error(error);
    }
  };
   
  return (
<div>
      <h1>Continents</h1>
      <input
        type="text"
        placeholder="Search country"
        value={searchCountry}
        onChange={handleSearchCountry}
      />

      {continents.map((continent) => (
        <div key={continent.name}>
          <button onClick={() => handleExpandContinent(continent.name)}>
            {expandedContinent === continent.name ? '-' : '+'}
          </button>
          <span>{continent.name}</span>

          {expandedContinent === continent.name && (
  <table>
    <thead>
      <tr>
        <th>Country</th>
        <th>Population</th>
        <th>Covid Cases</th>
        <th>Deaths</th>
      </tr>
    </thead>
    <tbody>
      {continent.countries.map((country) => (
        <tr key={country.name}>
          <td>{country.name}</td>
          <td>{country.population}</td>
          <td>{country.covidCases}</td>
          <td>{country.deaths}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

        </div>
      ))}

      {countryDetails && (
        <div>
          <h2>{countryDetails.name}</h2>
          <p>Population: {countryDetails.population}</p>
          <p>Covid Cases: {countryDetails.covidCases}</p>
          {countryDetails.newCases && <p>New Cases: {countryDetails.newCases}</p>}
          {countryDetails.deaths && <p>Deaths: {countryDetails.deaths}</p>}
        </div>
      )}
    </div>
  );
}

export default Covid_History;
