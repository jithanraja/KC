import React, { useState } from 'react';

const SearchBar = (props) => {
    const [inputValue, setInputValue] = useState("");
    const handleInput = (e) => {
        let value =e.target.value;
        setInputValue(value);
        props.handleSearch(value);
    };
    const clear = () => {
        setInputValue("");
        props.handleSearch("")
    };
    return <React.Fragment>
        <span className="clearable">
            <input
                type="text"
                id="header-search"
                placeholder="Search "
                name="s"
                value={inputValue}
                onChange={handleInput} />

            <i className="clearable__clear" onClick={clear}>&times;</i>
        </span>
    </React.Fragment>
}

export {
    SearchBar
}