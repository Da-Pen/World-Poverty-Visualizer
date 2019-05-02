import React from 'react';
import * as d3 from 'd3';
import './PovertyDiagram.scss';

export default class PovertyDiagram extends React.Component {

    margin = 1;

    render() {
        return (
            <div className={"PovertyDiagram " + this.props.className}>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        // if povertyData did not change, don't do anything
        if(JSON.stringify(prevProps.povertyData) === JSON.stringify(this.props.povertyData)) {
            return;
        }
        
        let data = this.props.povertyData;

        d3.selectAll('svg').remove(); // remove old canvas
        let canvas = d3.select('.PovertyDiagram')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');
        
        // calculate largest bar
        let highestBar = 0.0;
        for(let propertyName in data) {
            if(data[propertyName] > highestBar) {
                highestBar = data[propertyName];
            }
        }

        const bars = [
            {
                height: this.props.povertyData.share_80_100,
                width: 20
            },
            {
                height: this.props.povertyData.share_60_80,
                width: 20,
            },
            {
                height: this.props.povertyData.share_40_60,
                width: 20
            },
            {
                height: this.props.povertyData.share_20_40,
                width: 20
            },
            {
                height: this.props.povertyData.share_0_20,
                width: 20
            }
        ];
        
        let curX = 0;
        bars.forEach(bar => {
            canvas.append('rect')
                .attr('x', (curX + this.margin) + '%')
                .attr('y', (100*(1 - (bar.height / highestBar))) + "%")
                .attr('width', (bar.width - 2*this.margin) + '%')
                .attr('height', (100*(bar.height / highestBar)) + "%")
                .attr('fill', 'grey')
            curX += bar.width;
        });
    }

    // componentDidMount() {
    // }
}