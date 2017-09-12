//improvements to think about 
////1.  refactor the projection so I don't have to have a function inside a function- https://github.com/d3/d3-selection#joining-data
////2.  Get data from another source so I don't have to use feature to transform the map data before joining it to the other data
////3.  send id and value in as a prop???
////different way to highlight


//next up!
////1.  create a click function to update the data coming in and to filter it before the click occurs so that I can render the transition completely in this page
////2.  Extrac the functionality to the container page

import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {interpolate, interpolateHcl, interpolateHclLong, interpolateRgb, interpolateHsl, interpolateLab, interpolateCubehelix, interpolateCubehelixLong} from 'd3-interpolate'
import {max, min} from 'd3-array'
import { connect } from 'react-redux'
import { feature } from 'topojson-client'
import countryCodes from '../data/countryCodes'

import { geoMercator, geoPath } from 'd3-geo'

export default class WorldMap extends Component {
  constructor(props) {
    super(props)
    this.renderMap = this.renderMap.bind(this)
  }

  // transformMapRenderData(mapRenderData) {
  //   return feature(mapRenderData, mapRenderData.objects.countries).features
  // }

  // joinData(mapDisplayData, mapRenderData) {
  //   const mapRenderDataTransformed = this.transformMapRenderData(mapRenderData)
  //   return mapRenderDataTransformed.map(renderDataCountry => {
  //     const displayDataIndex = mapDisplayData.findIndex(displayDataCountry => {
  //       return renderDataCountry.id === displayDataCountry.id
  //     })
  //     if (displayDataIndex !== -1) {
  //       renderDataCountry.displayDataValue = mapDisplayData[displayDataIndex].value
  //     } else {
  //       renderDataCountry.displayDataValue = undefined
  //     }
  //     return renderDataCountry
  //   })
  // }

  renderMap(props) {
    console.log("props", props)
    const node = this.node
    const width = node.width.animVal.value
    const height = node.height.animVal.value
    const mapData = props.mapData
    console.log('map Data')
    // const mapData = this.joinData(props.mapDisplayData, props.mapRenderData)
    // const valueDetails = props.valueDetails  //props.mapDisplayData[index][valueDetails] provides Value
    const maxMapDisplayData = max(mapData, d=>{
     return d.displayDataValue
    })
    const minMapDisplayData = min(mapData, d=>{
      if(d.displayDataValue) return d.displayDataValue
    })
    
    const colorScale = scaleLinear()
      .domain([minMapDisplayData, maxMapDisplayData])
      .range(["red", "violet"])
      .interpolate(interpolateHclLong)
       colorScale.clamp(true)


  


    select(node)
      .append('g')
      .classed('countries', true)

    const countries = select('g')
      .selectAll('path')
      .data(mapData)
    
    countries.enter()
      .append('path')
        .classed('country', true)
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("strokeWidth", 0.75)
        .each(function (d, i) {
          //where to put these first 3 funcitons so I it is better- also issues with "this" if I call the in here
        
          const projection = () => {
            return geoMercator()
              .scale(150)
              .translate([width / 2, height / 1.5])
          }
          const dAttr = () => {
            return geoPath().projection(projection())(d)
          }
          select(this)
            .attr("d", dAttr())
            .attr("fill", colorScale(d.displayDataValue))
          })
       
        // .merge(countries)
        //   .each(function (d, i) {
        //     select(this)
        //       .attr("fill", colorScale(d.displayDataValue))
        //     })  
      
      //props.extractYear(node)
      countries.exit()
        .remove()
            
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.mapData.length) {
      this.renderMap(nextProps)
    }
  }

  shouldComponentUpdate() {
    return false;
  }



  render() {
    return (
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height} onClick = {()=>this.props.onClick(undefined, this.node)}>  {/*here is my issue!- if I want to reuse the function with the onclick, and the function is getting called in component will recieve props in the container... is there a way to run the container function without component will recieve props?  If so, how do I access the same props so that it's always calling the same datasource?  without setting the local state with the data and always pulling from there?  Do I need to have filter data in this function?  This would be a decent use case if you are always going to be using the same types of data sources in your code, but if you aren't going to be....  */}
      </svg>
    );
  }
}



