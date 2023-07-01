import React, {useState} from "react";
const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = localStorage.getItem(keyName);
            console.log(value)
            if (value) {
                console.log(JSON.parse(value))
                return JSON.parse(value);
            } else {
                localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            //console.log(err)
            return defaultValue;
        }
    });

    const setValue = newValue => {
        try {
            localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {}
        setStoredValue(newValue);
    };

    return [storedValue, setValue];
};

export default useLocalStorage;