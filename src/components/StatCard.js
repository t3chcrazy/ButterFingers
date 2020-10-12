import React from 'react'

function StatCard({stat, icon}) {

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

    const mapNum = () => {
        switch (icon) {
            case "bestAcc":
            case "meanAcc":
                return `${Math.round(stat*10000)/100} %`
            default:
                return `${stat} wpm`
        }
    }
    
    return (
        <div className = "statCard">
            <div className = "statRow">
                {mapTitle()}
            </div>
            <div className = "statRow">
                <div>{mapNum()}</div>
            </div>
        </div>
    )
}

export default StatCard