import React from 'react'

function StatCard({stat, icon}) {

    const mapIcon = () => {
        switch (icon) {
            case "bestWpm":
            case "bestAcc":
                return require("../assets/winner.svg")
            default:
                return require("../assets/winner.svg")
        }
    }

    const mapTitle = () => {
        switch (icon) {
            case "bestWpm":
                return "Best WPM"
            case "bestAcc":
                return "Best Accuracy"
            case "meanAcc":
                return "Mean Accuracy"
            default:
                return "Mean WPM"
        }
    }
    
    return (
        <div className = "statCard">
            <div className = "statRow">
                <img className = "statIcon" src = {mapIcon()} style = {{stroke: "#fff"}} />
                <div>{Math.round(stat*10)/10}</div>
            </div>
            <div className = "statRow">
                {mapTitle()}
            </div>
        </div>
    )
}

export default StatCard