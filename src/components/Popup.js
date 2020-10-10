import React from 'react'

function Popup({message, type}) {
    return (
        <div className = {`${type === "success"? "successPopup": "failurePopup"}`}>
            {message}
        </div>
    )
}

export default Popup