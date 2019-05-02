import React from 'react';
import Autocomplete from 'react-autocomplete';
import {countries} from './countries';

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.onSelectCountry = this.onSelectCountry.bind(this);
    }

    state = {value: ""};

    // returns true if the user input 'matches' the country
    doesInputMatchCountry(country, input) {
        if(input === "") {
            return false; // do not show matches if no input
        }
        return country.name.toLowerCase().includes(input.toLowerCase());
    }

    onSelectCountry(countryName, countryObject) {
        this.setState({value: countryName});
        this.props.onSelectCountry(countryObject);
    }

    inputWrapperStyle = {
        width: '60%',
        margin: '50px auto 0 auto'
    }

    render() {
        return (
            <div style={this.inputWrapperStyle}>
                <div>Choose a country</div>
                <Autocomplete
                    inputProps={{className: 'form-control'}}
                    wrapperStyle={{width: '100%'}}
                    getItemValue={(item) => item.name}
                    items={countries}
                    shouldItemRender = {this.doesInputMatchCountry}
                    renderItem={(item, isHighlighted) =>
                        <div key={item.code} style={{ paddingLeft:'5px', background: isHighlighted ? 'lightgray' : 'white' }}>
                            {item.name}
                        </div>
                    }
                    value={this.state.value}
                    onChange={(e) => this.setState({value: e.target.value})}
                    onSelect={this.onSelectCountry}
                />
            </div>
        );
        
    }
}