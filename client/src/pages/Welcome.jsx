import React from "react";
import MyInput from "../components/UI/Input/MyInput";

const Welcome = () => {
    return (
        <div>
            <h1>Welcome! Please rate at least 5 books</h1>
            <MyInput placeholder="Enter book titles to rate"></MyInput>
        </div>
    )
}

export default Welcome;