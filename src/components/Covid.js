import React, { useState, useEffect } from 'react';

const Covid = () => {
  const [data, setData] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleContinentChange = (event) => {
    setSelectedContinent(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchData = async () => {
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
      const result = await response.json();
      setData(result.response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const continentMatch = selectedContinent ? item.continent === selectedContinent : true;
    const searchTermMatch = item.country.toLowerCase().includes(searchTerm.toLowerCase());

    return continentMatch && searchTermMatch;
  });

  return (
    <div>
      <h1 className="text-center">COVID-19 App</h1>
      <div className="filters">
        <label htmlFor="continent-select">Select Continent:</label>
        <select id="continent-select" className="form-select-lg" onChange={handleContinentChange}>
          <option value="">All Continents</option>
          <option value="Asia">Asia</option>
          <option value="North-America">North America</option>
          <option value="Europe">Europe</option>
          <option value="South-America">South America</option>
          <option value="Africa">Africa</option>
          <option value="Oceania">Oceania</option>
        </select>
        <input
          className='ms-3 form-control-lg form-control-md form-control-sm w-40 mb-3'
          type="text"
          placeholder="Search by country..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="table table-primary">
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Total Cases</th>
            <th scope="col">Total Deaths</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td className="table-secondary">{item.country}</td>
              <td className="table-success">{item.cases.total}</td>
              <td className="table-danger">{item.deaths.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Covid;
