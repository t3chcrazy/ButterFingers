import React, {useEffect} from 'react'
import {useSpring, animated} from 'react-spring'

const RADIUS = 100
const CIRCUM = 2*Math.PI*RADIUS
const durationSeconds = 5

function Timer({isActivated, handleRest}) {
    const [{offset}, setOffset, stopOffset] = useSpring(() => ({
        offset: 0, 
        config: {duration: durationSeconds*1000},
        onRest: () => {
            if (offset.getValue() === CIRCUM) {
                handleRest()
            }
        },
    }))

    const timeLeft = offset.interpolate({
        range: [0, CIRCUM],
        output: [durationSeconds, 0]
    })

    useEffect(() => {
        if (isActivated) {
            setOffset({offset: CIRCUM})
        }
    }, [isActivated])

    return (
        <div className = "svgContainer">
            <svg width = "220" height = "220">
                <animated.circle 
                    cx = "110" 
                    cy = "110" 
                    r = "100" 
                    fill = "none" 
                    stroke = "#3498db" 
                    strokeDasharray = {`${CIRCUM} ${CIRCUM}`} 
                    strokeDashoffset = {offset} 
                    strokeWidth = "10" 
                    strokeLinejoin = "round" 
                />
            </svg>
            <animated.div className = "timeContainer">
                {timeLeft.interpolate(v => v.toFixed(2))}
            </animated.div>
        </div>
    )
}

export default Timer