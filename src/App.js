// import React, { useState } from 'react';
// import History from './components/History';
// import './App.css';
// const App = () => {
//   // Sample data
//   const data = History;
    

//   const [selectedContinent, setSelectedContinent] = useState('');

//   const handleContinentChange = (event) => {
//     setSelectedContinent(event.target.value);
//   };

//   const filteredData = selectedContinent
//     ? data.filter((item) => item.continent === selectedContinent)
//     : data;

//   return (
//     <div>

//       <h1 className='text-center'>COVID-19 App</h1>
//       <label htmlFor="continent-select">Select Continent:</label>
//       <select id="continent-select" class="form-select-lg" onChange={handleContinentChange}>
//         <option value="">All Continents</option>
        
//         <option value="Asia">Asia</option>
//         <option value="North-America">North America</option>
//         <option value="Europe">Europe</option>
//         <option value="South-America">South-America</option>
//         <option value="Africa">Africa</option>
//         <option value="Oceania">Oceania</option>


//         {/* Add more continent options here */}
//       </select>

// <table class="table table-primary">
//   <thead>
//     <tr>
//       <th scope="col">Country</th>
//       <th scope="col">Total Cases</th>
//       <th scope="col">Total Deaths</th>
      
//     </tr>
//   </thead>
//   <tbody>
//           {filteredData.map((item, index) => (
//             <tr key={index}>
//               <td className='table-secondary'>{item.country}</td>
//               <td className='table-success'>{item.cases.total}</td>
//               <td className='table-danger'>{item.deaths.total}</td>
//             </tr>
//           ))}
//         </tbody>
// </table>


//     </div>
//   );
// };

// export default App;



import React, { useState } from 'react';
import History from './components/History';
import './App.css';

const App = () => {
  const data = History;

  const [selectedContinent, setSelectedContinent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleContinentChange = (event) => {
    setSelectedContinent(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) => {
    const continentMatch = selectedContinent
      ? item.continent === selectedContinent
      : true;

    const searchTermMatch = item.country.toLowerCase().includes(searchTerm.toLowerCase());

    return continentMatch && searchTermMatch;
  });

  return (
    <div>
      <h1 className='text-center'>COVID-19 App</h1>
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
          type="text"
          className='ms-3 form-control-lg'
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

export default App;
