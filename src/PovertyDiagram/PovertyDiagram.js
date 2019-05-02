import React from 'react';
import d3 from 'd3';
import d3Tip from 'd3-tip';
import './PovertyDiagram.scss';
d3.tip = d3Tip;

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

        var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
        var formatPercent = d3.format(".0%");
        
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        
        var y = d3.scale.linear()
            .range([height, 0]);
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);
        
        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.value + "</span>";
        })
        
        
        d3.selectAll('svg').remove(); // remove old canvas
        let svg = d3.select('.PovertyDiagram').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        svg.call(tip);
        
        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");
        
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)    













        // d3.selectAll('svg').remove(); // remove old canvas
        // let canvas = d3.select('.PovertyDiagram')
        //     .append('svg')
        //     .attr('width', '100%')
        //     .attr('height', '100%');
        
        // // calculate largest bar
        // let highestBar = 0.0;
        // for(let propertyName in data) {
        //     if(data[propertyName] > highestBar) {
        //         highestBar = data[propertyName];
        //     }
        // }

        // const bars = [
        //     {
        //         height: this.props.povertyData.share_80_100,
        //         width: 20
        //     },
        //     {
        //         height: this.props.povertyData.share_60_80,
        //         width: 20,
        //     },
        //     {
        //         height: this.props.povertyData.share_40_60,
        //         width: 20
        //     },
        //     {
        //         height: this.props.povertyData.share_20_40,
        //         width: 20
        //     },
        //     {
        //         height: this.props.povertyData.share_0_20,
        //         width: 20
        //     }
        // ];
        
        // let curX = 0;
        // bars.forEach(bar => {
        //     canvas.append('rect')
        //         .attr('x', (curX + this.margin) + '%')
        //         .attr('y', (100*(1 - (bar.height / highestBar))) + "%")
        //         .attr('width', (bar.width - 2*this.margin) + '%')
        //         .attr('height', (100*(bar.height / highestBar)) + "%")
        //         .attr('fill', 'steelblue')
        //     curX += bar.width;
        // });
    }

    // componentDidMount() {
    // }
}