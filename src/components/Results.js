import React from 'react'
import {animated} from 'react-spring'

function Results({correctWords, wrongWords, homeOpacity}) {

    const numWordsTyped = () => correctWords + wrongWords

    return (
        <animated.div className = "resultContainer absContainer" style = {{
            bottom: homeOpacity.interpolate(v => `-${v*50}px`),
            opacity: homeOpacity.interpolate(v => 1-v),
            pointerEvents: homeOpacity.getValue() === 0? "auto": "none"
        }}>
            <div>
                Congratulations! You did great!
            </div>
            <h3>
                Your results: 
            </h3>
            <div className = "results">
                <div className = "resultTitle">
                    WPM
                </div>
                <div className = "resultStat">
                    {(numWordsTyped())/5}
                </div>
                <div className = "resultTitle">
                    Accuracy
                </div>
                <div className = "resultStat">
                    {`${Math.round(correctWords/numWordsTyped()*100)} %`}
                </div>
                <div className = "resultTitle">
                    Correct words
                </div>
                <div className = "resultStat">
                    {correctRef.current}
                </div>
                <div className = "resultTitle">
                    Wrong words
                </div>
                <div className = "resultStat">
                    {wrongRef.current}
                </div>
            </div>
            <button onClick = {handleTrial}>
                Try again!
            </button>
        </animated.div>
    )
}

export default Results