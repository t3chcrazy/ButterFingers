import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import StatCard from  '../components/StatCard'
import StatPlot from '../components/StatPlot'
import Footer from '../components/Footer'
import '../css/Profile.css'

const RESULTS = [
    {
        id: 1,
        date: new Date(),
        wpm: 132,
        accuracy: 85,
    },
    {
        id: 2,
        date: new Date(2020, 9, 19),
        wpm: 89,
        accuracy: 70,
    },
    {
        id: 3,
        date: new Date(2020, 9, 20),
        wpm: 93,
        accuracy: 91
    }
]

function Profile() {
    const [results, setResults] = useState(() => RESULTS)
    const [stats, setStats] = useState(null)
    const [width, setWidth] = useState(0)
    const token = useMemo(() => localStorage.getItem("token"), [])

    // TODO
    useLayoutEffect(() => {
        function updateSize() {
            setWidth(window.innerWidth)
        }
        window.addEventListener("resize", updateSize)
        updateSize()
        return () => window.removeEventListener("resize", updateSize)
    }, [])

    const dateData = useMemo(() => results.map(r => r.date), [])

    useEffect(() => {
        (async function() {
            try {
                const result = await fetch("/getuser", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token
                    }
                })
                const data = await result.json()
                if (result.status !== 200) {
                    throw Error("User fetch unsuccessfull")
                }
                
            }
            catch (err) {
                console.log("Error occured", err)
            }
        })()
        const resultsLength = RESULTS.length
        let bestWpm = 0
        let sumWpm = 0
        let bestAcc = 0
        let sumAcc = 0
        RESULTS.forEach(r => {
            const currWpm = r.wpm
            const currAcc = r.accuracy
            bestWpm = Math.max(bestWpm, currWpm)
            bestAcc = Math.max(bestAcc, currAcc)
            sumWpm += currWpm
            sumAcc += currAcc
        })
        setStats({
            bestWpm,
            bestAcc,
            meanWpm: sumWpm/resultsLength,
            meanAcc: sumAcc/resultsLength
        })
    }, [])

    return (
        <div className = "profileContainer">
            <div className = "profileBanner">
                <div className = "userDetails">
                    <div>Abhishek Prashant</div>
                    <div>suman4283@gmail.com</div>
                </div>
                <div className = "featureContainer">
                    {stats && <div className = "featureRow">
                        {Object.entries(stats).map((s, i) => <StatCard key = {i} icon = {s[0]} stat = {s[1]} />)}
                    </div>}
                </div>
            </div>
            <main className = "plotContainer">
                <StatPlot
                    color = "green"
                    title = "WPM Plot"
                    xData = {dateData}
                    yData = {results.map(r => r.wpm)}
                    currWidth = {width}
                    mean = {stats? stats["meanWpm"]: 0}
                />
                <StatPlot
                    color = "red"
                    title = "Accuracy Plot"
                    xData = {dateData}
                    yData = {results.map(r => r.accuracy)}
                    currWidth = {width}
                    mean = {stats? stats["meanAcc"]: 0}
                />
            </main>
            <Footer />
        </div>
    )
}

export default Profile