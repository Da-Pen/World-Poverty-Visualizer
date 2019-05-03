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

        let containerBox = d3.select('.PovertyDiagram').node().getBoundingClientRect();

        var margin = {top: 40, right: 20, bottom: 50, left: 70},
        width = containerBox.width - margin.left - margin.right,
        height = containerBox.height - margin.top - margin.bottom;
    
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
            .tickFormat(d => d + "%");
        
        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return `Income share held by ${d.name}: <span style='color: lightblue'>${d.value}%</span>`;
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
            .text("Income share");
        
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
    }
}