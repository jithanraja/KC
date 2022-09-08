import React from 'react';

const TextArea = (props) => {
    return <React.Fragment>
        <label htmlFor={props.name} className="form-label">{props.label}</label>
        <textarea className="form-control" 
            onClick={props.onClick}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            name={props.name}
            placeholder={props.placeholder || props.label}
            autoComplete={'off'}
            disabled={props.disabled || false}
            readOnly={props.readOnly || false}
            rows={6}
            style={{ resize: 'none' }}
        />
        {props.isFormikSupported && props.isTouched && props.error && <div className="pt-2 form-error text-danger">{props.error}</div>}
    </React.Fragment>
}

export {
    TextArea
}