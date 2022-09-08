const SubmitButton = (props) => {
    return <button className="submitButton" {...props}>{props.children}</button>
}

const CancelButton = (props) => {
    return <button className="cancelButton" {...props}>{props.children}</button>
}

export {
    SubmitButton,
    CancelButton
}