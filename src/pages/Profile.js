import React, { useEffect, useMemo, useState, useLayoutEffect, useRef } from 'react'
import StatCard from  '../components/StatCard'
import StatPlot from '../components/StatPlot'
import Footer from '../components/Footer'
import '../css/Profile.css'


const calcStats = results => {
    const resultsLength = results.length
    let bestWpm = 0
    let sumWpm = 0
    let bestAcc = 0
    let sumAcc = 0
    results.forEach(r => {
        const currWpm = r.wpm
        const currAcc = r.accuracy
        bestWpm = Math.max(bestWpm, currWpm)
        bestAcc = Math.max(bestAcc, currAcc)
        sumWpm += currWpm
        sumAcc += currAcc
    })
    return {
        bestWpm,
        bestAcc,
        meanWpm: sumWpm/resultsLength,
        meanAcc: sumAcc/resultsLength
    }
}

function Profile() {
    const [results, setResults] = useState(null)
    const stats = useRef(null)
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

    console.log(results && results.records.map(r => new Date(r.date).toUTCString()))

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
                if (result.status !== 200) {
                    throw Error("User fetch unsuccessfull")
                }
                const data = await result.json()
                const userData = data.data
                console.log("Here is data", userData)
                stats.current = calcStats(userData.records)
                setResults(userData)
            }
            catch (err) {
                console.log("Error occured", err)
            }
        })()
    }, [token])

    return (
        <>
            {results !== null? <div className = "profileContainer">
            <div className = "profileBanner">
                <div className = "userDetails">
                    <div>{results.name}</div>
                    <div>{results.email}</div>
                </div>
                <div className = "featureContainer">
                    {stats && <div className = "featureRow">
                        {Object.entries(stats.current).map((s, i) => <StatCard key = {i} icon = {s[0]} stat = {s[1]} />)}
                    </div>}
                </div>
            </div>
            <main className = "plotContainer">
                <StatPlot
                    color = "green"
                    title = "WPM Plot"
                    xData = {results.records.map(r => new Date(r.date))}
                    yData = {results.records.map(r => r.wpm)}
                    currWidth = {width}
                    mean = {stats? stats["meanWpm"]: 0}
                />
                <StatPlot
                    color = "red"
                    title = "Accuracy Plot"
                    xData = {results.records.map(r => new Date(r.date))}
                    yData = {results.records.map(r => r.accuracy)}
                    currWidth = {width}
                    mean = {stats? stats["meanAcc"]: 0}
                />
            </main>
            <Footer />
            </div>: 
            <div className = "loadScreen">
                Loading...
            </div>}
        </>
    )
}

export default Profile