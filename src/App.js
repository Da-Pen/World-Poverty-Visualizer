import React from 'react';
import './App.scss';

import SearchBar from './SearchBar/SearchBar';
import PovertyDiagram from './PovertyDiagram/PovertyDiagram';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      year: (new Date()).getFullYear(),
      povertyData: [],
      country: "",
      loading: false,
      failGetInfo: false
    };
    this.onSelectCountry = this.onSelectCountry.bind(this);
  }

  indicators = [
      'SI.DST.05TH.20', // income share held by highest 20%
      'SI.DST.04TH.20', // income share held by fourth 20%
      'SI.DST.03RD.20', // income share held by third 20%
      'SI.DST.02ND.20', // income share held by second 20%
  ]

  getPovertyData(indicatorArray) {
    this.setState({
      povertyData: [
        {
          name: "0-20%",
          value: parseFloat((100 - (indicatorArray[0] + indicatorArray[1] + indicatorArray[2] + indicatorArray[3])).toFixed(1))
        },
        {
          name: "20-40%",
          value: indicatorArray[3],
        },
        {
          name: "40-60%",
          value: indicatorArray[2],
        },
        {
          name: "60-80%",
          value: indicatorArray[1],
        },
        {
          name: "80-100%",
          value: indicatorArray[0]
        }
      ]
    });
  }

  onSelectCountry(countryObject) {
    this.setState({country: countryObject.name});
    // get indicators query string
    const indicatorsQuery = this.indicators.join(';');
    this.setState({loading: true});
    this.setState({failGetInfo: false});
    fetch(`https://api.worldbank.org/v2/country/${countryObject.code}/indicator/${indicatorsQuery}?source=2&format=json&date=${this.state.year}`)
      .then(res => res.json())
      .then(
        (res) => {
          if(!res || !res[0] || res[0].message) {
            this.setState({failGetInfo: true, loading: false});
            this.setState({year: (new Date()).getFullYear()}); // reset year
            return;
          }
          if(res[0].pages !== 0 && res[1].every(indicator => indicator.value != null)) {
            this.setState({loading: false});
            this.getPovertyData(res[1].map(indicator => indicator.value));
          } else {
            if(this.state.year <  (new Date()).getFullYear() - 10) {
              this.setState({failGetInfo: true, loading: false});
              this.setState({year: (new Date()).getFullYear()}); // reset year
            } else {
              this.setState({year: this.state.year - 1});
              this.onSelectCountry(countryObject);
            }
          }
        }
      )
  }

  render() {
    return (
      <div className="App d-flex flex-column">
        <SearchBar onSelectCountry={this.onSelectCountry} />
        <div className="flex-grow-1 px-5">
          <PovertyDiagram povertyData={this.state.povertyData} className={this.state.loading || this.state.failGetInfo ? "d-none" : ""}/>
          <p className={"text-center pt-5 " + (this.state.failGetInfo ? "" : "d-none")}>World Bank does not have recent poverty distribution data for '{this.state.country}' :(</p>
          <p className={"text-center pt-5 " + (this.state.loading ? "" : "d-none")}>Loading...</p>
        </div>
      </div>
    );
  }


}

export default App;
