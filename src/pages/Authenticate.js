import React, {useState, useCallback, useRef, useEffect} from 'react';
import {useSpring, animated} from 'react-spring';
import Footer from '../components/Footer'
import Popup from '../components/Popup'
import {useHistory} from 'react-router-dom'
import '../css/Authenticate.css';

const MODE = {
    REGISTER: 0,
    LOGIN: 1,
}

const features = [
    "Check your WPM speeds",
    "Increase your accuracy",
    "Analyze your data"
]

function Authenticate() {
    const [mode, setMode] = useState(MODE.LOGIN)
    const [show, setShow] = useState(null)
    const [loginMessage, setLoginMessage] = useState(null)
    const loginEmail = useRef()
    const loginPassword = useRef()
    const registerName = useRef()
    const registerEmail = useRef()
    const registerPassword = useRef()

    const history = useHistory()

    const [{ value }, setVal, _] = useSpring(() => ({value: 0}))
    const [{ slide }, setSlide, stopSlide] = useSpring(() => ({slide: 1, config: {
        duration: 10000,
    }}))

    useEffect(() => {
        setSlide({to: async next => {
            while (true) {
                await next({slide: 10})
                await next({slide: 1})
            }
        }})
        return () => {
            stopSlide()
        }
    }, [])

    useEffect(() => {
        setVal({value: mode === MODE.LOGIN? 0: 20})
    }, [mode])

    const featureAnims = features.map((f, oIndex) => slide.interpolate({
        range: new Array(4).fill(0).map((val, iIndex) => 3*oIndex+iIndex+1),
        output: [-50, 0, 0, -50],
        extrapolate: "clamp"
    }))

    const handleLoginButton = useCallback(() => {
        setMode(prev => prev === MODE.LOGIN? prev: MODE.LOGIN)
    }, [])

    const handleRegisterButton = useCallback(() => {
        setMode(prev => prev === MODE.REGISTER? prev: MODE.REGISTER)
    }, [])

    const handleLink = useCallback((e) => {
        e.preventDefault()
        setMode(prev => prev === MODE.REGISTER? prev: MODE.REGISTER)
    }, [])

    const handleRegister = async e => {
        e.preventDefault()
        const body = {
            "name": registerName.current.value,
            "email": registerEmail.current.value,
            "password": registerPassword.current.value
        }
        console.log("body on the client side", body)
        console.log("Am i run")
        try {
            const result = await fetch("/signup", {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (result.status === 401) {
                throw Error(`Signup unsuccessfull - ${result.status}`)
            }
            setShow("success")
        }
        catch (err) {
            console.log(err.message)
            setShow("failure")
        }
        finally {
            setTimeout(() => {
                setShow(null)
            }, 3000)
        }
    }

    const handleLogin = async e => {
        e.preventDefault()
        const body = {
            email: loginEmail.current.value,
            password: loginPassword.current.value,
        }
        console.log(body)
        try {
            const result = await fetch("/signin", {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log("is this running?", result, body)
            if (result.status === 400) {
                throw Error(result.message)
            }
            const data = await result.json()
            localStorage.setItem("token", data.token.toString())
            setLoginMessage("successLogin")
            setTimeout(() => {
                history.replace("/main")
            }, 3000)
        }
        catch (err) {
            console.log(err)
            setLoginMessage("failureLogin")
        }
        finally {
            setTimeout(() => {
                setLoginMessage(null)
            }, 3000)
        }
    }

    const matchShow = (type) => show && show === type

    const matchMessage = (type) => loginMessage && loginMessage.startsWith(type)
        
    return (
        <>
            <div className = "authenticateContainer">
                <div className = "authenticateColumn">
                    <div className = "title">Butterfingers</div>
                    <div className = "buttonContainer">
                        <button onClick = {handleLoginButton}>Login</button>
                        <button onClick = {handleRegisterButton}>Register</button>
                        <animated.div className = "bottomIndicator" style = {{
                            left: value.interpolate(v => `${v/2}rem`)
                        }}>
                        </animated.div>
                    </div>
                    <div className = "featureContainer">
                        {featureAnims.map((anim, ind) => 
                        <animated.div className = "feature" key = {`feature${ind}`} style = {{
                            bottom: anim.interpolate(v => `${v}px`)
                        }}>
                            {features[ind]}
                        </animated.div>)}
                    </div>
                    <div className = "wrapper">
                        <animated.form onSubmit = {handleLogin} className = "animatedForm" style = {{
                            transform: value.interpolate(v => `translateX(${-v}rem)`)
                        }}>
                            <input placeholder = "Email" ref = {loginEmail} type = "text" />
                            <input placeholder = "Password" ref = {loginPassword} type = "password" />
                            <button onClick = {handleLink} className = "registerLink">Not registered? Click here!</button>
                            <button className = "formButton" type = "submit">Login</button>
                        </animated.form>
                        <animated.form onSubmit = {handleRegister} className = "animatedForm" style = {{
                            transform: value.interpolate(v => `translateX(${20-v}rem)`)
                        }}>
                            <input placeholder = "Name" ref = {registerName} />
                            <input placeholder = "Email" ref = {registerEmail} />
                            <input placeholder = "Password" ref = {registerPassword} type = "password" />
                            <button className = "formButton" type = "submit">Register</button>
                        </animated.form>
                    </div>
                </div>
            </div>
            {matchShow("success") && <Popup message = "Signup successfull!" type = "success" />}
            {matchShow("failure") && <Popup message = "Signup unsuccessfull" type = "failure" />}
            {matchMessage("success") && <Popup message = "Login Successfull!" type = "success" />}
            {matchMessage("failure") && <Popup message = "Login unsuccessfull" type = "failure" />}
            <Footer />
        </>
    )
}

export default Authenticate