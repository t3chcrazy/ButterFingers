import React, {useRef, useEffect} from 'react'
import '../css/Word.css'

function Word({spanText, spanIndex, currIndex, currText, handleIncrease, handleDecrease}) {
    const spanRef = useRef()
    
    useEffect(() => {
        if (!spanRef.current.classList.contains("complete")) {
            if (currIndex === spanIndex) {
                spanRef.current.classList.toggle("active")
            }
            else if (currIndex > spanIndex) {
                spanRef.current.classList.toggle("active")
                spanRef.current.classList.toggle("complete")
                if (spanText === currText) {
                    handleIncrease()
                    spanRef.current.classList.toggle("correct")
                }
                else {
                    handleDecrease()
                    spanRef.current.classList.toggle("wrong")
                }
            }
        }
    }, [currIndex])

    return (
        <span className = "word" ref = {spanRef}>
            {spanText}
        </span>
    )
}

export default Word