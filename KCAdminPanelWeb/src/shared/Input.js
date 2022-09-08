import React from 'react';

const Input = (props) => {
    return <React.Fragment>
        <label htmlFor={props.name} className="form-label">{props.label}</label>
        <input className="form-control" 
            onClick={props.onClick}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            name={props.name}
            placeholder={props.placeholder || props.label}
            type={props.type || 'text'}
            autoComplete={props.type === 'password' ? 'new-password' : 'off'}
            disabled={props.disabled || false}
            readOnly={props.readOnly || false}
        />
        {props.isFormikSupported && props.isTouched && props.error && <div className="pt-2 form-error text-danger">{props.error}</div>}
    </React.Fragment>
}

export {
    Input
}