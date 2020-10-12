import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {animated, useSpring} from 'react-spring'
import Footer from '../components/Footer'
import Word from '../components/Word'
import Timer from '../components/Timer'
import {useHistory} from 'react-router-dom'
import '../css/Main.css'

const PAGE_STATE = {
    HOME: 1,
    RESULTS: 2,
}

const TEXTS = [
    "A king was once hunting in a large wood. He pursued his game so hotly that none of his courtiers could follow him. But when evening approached he stopped and looking around him perceived that he had lost himself. He sought a path out of the forest, but could not find one and presently he saw an old woman with a nodding head who came up to him. My good woman, said he to her, can you not show me the way out of the forest? Oh, yes, my lord king, she replied; I can do that very well."
]

function MainPage() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [textArray, setTextArray] = useState(() => TEXTS[0].split(" "))
    const inputRef = useRef()
    const correctRef = useRef(0)
    const wrongRef = useRef(0)
    const [page, setPage] = useState(() => PAGE_STATE.HOME)
    const [isActivated, setActivated] = useState(false)
    const [sentText, setSentText] = useState("")
    const [{homeOpacity}, setOpacity, stopOpacity] = useSpring(() => ({homeOpacity: 1}))
    const token = useMemo(() => localStorage.getItem("token"), [])

    const history = useHistory()

    const handleInput = event => {
        if (event.which === 32) {
            event.preventDefault()
            setSentText(inputRef.current.value)
            setActiveIndex(activeIndex+1)
            inputRef.current.value = ""
        }
    }

    useEffect(() => {
        setOpacity({homeOpacity: page === PAGE_STATE.HOME? 1: 0})
        if (page === PAGE_STATE.RESULTS) {
            (async function() {
                const currStat = {
                    date: new Date(),
                    wpm: numWordsTyped().toFixed(2),
                    accuracy: correctRef.current/numWordsTyped().toFixed(2)
                }
                try {
                    const result = await fetch("/score/submit", {
                        method: "POST",
                        body: JSON.stringify(currStat),
                        headers: {
                            "Content-Type": "application/json",
                            token
                        }
                    })
                    if (result.status !== 200) {
                        const message = await result.json()["message"]
                        throw Error(message)
                    }
                }
                catch (err) {
                    console.log("Score submission unsuccessfull", err)
                }
            })()
        }
    }, [page])

    const handleIncrease = () => correctRef.current++

    const handleDecrease = () => wrongRef.current++

    const handleTrial = () => {
        setPage(PAGE_STATE.HOME)
        setActivated(false)
        Object.values(document.getElementsByClassName("word")).forEach(node => {
            node.classList = ["word"]
        })
        setActiveIndex(0)
        correctRef.current = 0
        wrongRef.current = 0
    }

    const handleRest = useCallback(() => {
        setPage(PAGE_STATE.RESULTS)
    }, [])

    const isPageHome = () => page === PAGE_STATE.HOME

    const numWordsTyped = () => correctRef.current+wrongRef.current

    const handleLogout = () => {
        localStorage.removeItem("token")
        history.replace("/")
    }

    const handleFBShare = () => {
        window.shareFB({
            display: "popup",
            method: "share",
            href: "https://developers.facebook.com/docs/",
            quote: `I got ${correctRef.current/numWordsTyped()} wpm on Butterfingers! Check it out!`
        })
    }

    return (
        <div>
            <nav className = "topNav">
                <div>Butterfingers</div>
                <div className = "topButtons">
                    <button onClick = {() => history.push("/profile")}>
                        Profile
                    </button>
                    <button onClick = {handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            <div className = "wrapperContainer">
                <animated.div className = "mainContainer absContainer" style = {{
                    bottom: homeOpacity.interpolate(v => `-${(1-v)*50}px`),
                    opacity: homeOpacity,
                    pointerEvents: isPageHome()? "auto": "none"
                }}>
                    <div className = "mainAppContainer">
                        <div className = "textContainer">
                            {textArray && textArray.map((text, ind) => 
                            <Word
                                key = {ind}
                                currIndex = {activeIndex}
                                currText = {sentText}
                                spanIndex = {ind}
                                spanText = {text}
                                handleIncrease = {handleIncrease}
                                handleDecrease = {handleDecrease}
                            />)}
                        </div>
                        <div className = "inputContainer">
                            <input
                                ref = {inputRef}
                                type = "text"
                                onKeyPress = {handleInput}
                                placeholder = "Start typing!"
                            />
                        </div>
                    </div>
                    {page && page === PAGE_STATE.HOME &&
                    <Timer
                        isActivated = {isActivated}
                        handleRest = {handleRest}
                    />}
                </animated.div>
                <animated.div className = "resultContainer absContainer" style = {{
                    bottom: homeOpacity.interpolate(v => `-${v*50}px`),
                    opacity: homeOpacity.interpolate(v => 1-v),
                    pointerEvents: !isPageHome()? "auto": "none"
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
                            {`${Math.round(correctRef.current/numWordsTyped()*100)} %`}
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
                    <button onClick = {handleFBShare}>
                        Share
                    </button>
                </animated.div>
            </div>
            <button onClick = {() => setActivated(true)}>
                Trigger
            </button>
            <Footer />
        </div>
    )
}

export default MainPage