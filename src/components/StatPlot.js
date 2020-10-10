import React from 'react'
import Plot from 'react-plotly.js'

function StatPlot({title, xData, yData, color, currWidth: width, mean}) {

    const mapMargin = () => width > 992? "2rem": "0"

    const mapWidth = () => width > 768? 0.8*width: width

    const mapHeight = () => width > 768? 0.4*width: 450

    return (
        <Plot
            data = {[
                {
                    x: xData,
                    y: yData,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: {color}
                }
            ]}
            layout = {{width: mapWidth(), height: mapHeight(), title, shapes: [
                {
                    xref: "paper",
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: mean,
                    y1: mean,
                    line: {
                        color: "yellow",
                        width: 2,
                    },
                    name: "Mean"
                }
            ]}}
            style = {{margin: `1rem ${mapMargin()}`}}
        />
    )
}

export default StatPlot