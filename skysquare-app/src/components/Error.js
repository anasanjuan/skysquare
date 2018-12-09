import React from 'react'

function Error(props) {
    return <div className={props.containerClass}onClick={props.onErrorOkClick}>
        <p className={props.className}>{props.message}</p>
    </div>
}

export default Error
// module.exports = logic
