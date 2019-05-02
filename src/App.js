import React from 'react';
import './App.scss';

import SearchBar from './SearchBar/SearchBar';
import PovertyDiagram from './PovertyDiagram/PovertyDiagram';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      year: (new Date()).getFullYear(),
      povertyData: {},
      loading: false
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
      povertyData: {
        share_0_20: indicatorArray[0],
        share_20_40: indicatorArray[1],
        share_40_60: indicatorArray[2],
        share_60_80: indicatorArray[3],
        share_80_100: parseFloat((100 - (indicatorArray[0] + indicatorArray[1] + indicatorArray[2] + indicatorArray[3]))
          .toFixed(1)),
      }
    });
  }

  failGetInfo(country) {
    this.setState({loading: false});
    console.log('World Bank has no recent poverty info for country ' + country);
  }

  onSelectCountry(countryObject) {
    // get indicators query string
    const indicatorsQuery = this.indicators.join(';');
    this.setState({loading: true});
    fetch(`https://api.worldbank.org/v2/country/${countryObject.code}/indicator/${indicatorsQuery}?source=2&format=json&date=${this.state.year}`)
      .then(res => res.json())
      .then(
        (res) => {
          if(res[0].pages !== 0 && res[1].every(indicator => indicator.value != null)) {
            this.setState({loading: false});
            this.getPovertyData(res[1].map(indicator => indicator.value));
          } else {
            if(this.state.year <  (new Date()).getFullYear() - 10) {
              this.failGetInfo(countryObject.name);
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
        <PovertyDiagram povertyData={this.state.povertyData} className={"flex-grow-1" + (this.state.loading ? " invisible" : "")}/>
      </div>
    );
  }


}

export default App;
