import React, { useEffect, useState } from 'react';
import InfoBox from "./InfoBox";
import expand from 'emmet';
import Map from "./Map";
import './App.css';
import Table from "./Table";
import {sortData, prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
//  import "./Open.js";
//import {showDataOnMap} from "./util";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
}from "@material-ui/core";


function App() {
 const[countries, setCountries]=useState([]);
 const [country,setCountry]=useState(['worldwide']);
 const [countryInfo,setCountryInfo]=useState({});
 const [tableData,setTableData]=useState([]);
 const [mapCenter,setMapCenter]=useState({lat:34.80746, lng:-404796});
 const [mapZoom,setMapZoom]=useState(3);
 const [mapCountries,setMapCountries]=useState([]);
 const [casesType, setCasesType]=useState("cases");

 
 useEffect(() => {
   fetch("https://disease.sh/v3/covid-19/all")
   .then((response) => response.json())
   .then((data)=> {
     setCountryInfo(data)
   });
 },[]);

//https://disease.sh/v3/covid-19/countries
useEffect(()=>{
  //runs code once when component loads
  //asyn func
  const getCountriesData=async()=>{
     await fetch("https://disease.sh/v3/covid-19/countries")
     .then((response)=>response.json())
     .then((data) => {
      const countries=data.map((country) => (
        {
          name:country.country,
          value:country.countryInfo.iso2
        }));  
        const sortedData=sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
     });
  };
 
  getCountriesData();
},[]);
const onCountryChange= async (e)=>{
  const countryCode=e.target.value;
  console.log("whatsup>>>>",countryCode);
  const url=countryCode=='worldwide'?'https://disease.sh/v3/covid-19/all'
  :`https://disease.sh/v3/covid-19/countries/${countryCode}`;
  
  await fetch(url)
  .then(response=>response.json())
  .then(data=>{
    setCountry(countryCode);
    setCountryInfo(data);

    setMapCenter([data.countryInfo.lat, data.countryInfo.long,]);
    setMapZoom(4);
  });
};
console.log('country info>>',countryInfo);
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1>LIVE_COVID</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map(country=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
         
           {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">World</MenuItem>
            <MenuItem value="worldwide">Wwhatsappp</MenuItem>
            <MenuItem value="worldwide">yooooo</MenuItem>
  <MenuItem value="worldwide">kaushic</MenuItem>*/}
           
            
          </Select>
      </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox  isRed active={casesType==="cases"} onClick={(e) =>setCasesType('cases')}title="Coronavirus Cases"cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox active={casesType==="recovered"}onClick={(e)=>setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox isRed active={casesType==="deaths"}onClick={(e)=>setCasesType('deaths')} title="Diseased" cases={prettyPrintStat(countryInfo.todayDeaths)} total={pre ttyPrintStat(countryInfo.deaths)}/>
        <InfoBox active={casesType==="activePerOneMillion"}onClick={(e)=>setCasesType('activePerOneMillion')} title="ActivePerMillion" cases={prettyPrintStat(countryInfo.activePerOneMillion)}/>
       <InfoBox active={casesType==="testsPerOneMillion"}onClick={(e)=>setCasesType('testsPerOneMillion')} title="TestedPerMillion" cases={prettyPrintStat(countryInfo.testsPerOneMillion)} />
         {/*infobox*/} 
         {/*infobox*/}
      </div>

     
      {/*Table*/}   
      {/*graph*/}
      <Map 
      countries={mapCountries}
      casesType={casesType}
      center={mapCenter}
      zoom={mapZoom}
      />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>

      </Card>

      {/*map*/}
    </div>
  );
};

export default App;
