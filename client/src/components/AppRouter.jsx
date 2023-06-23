import React, { useState } from "react";

import Login from '../pages/Login';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import Recommendations from '../pages/Recommendations';
import MyBooks from '../pages/MyBooks';
import { Route, Routes, Navigate } from "react-router-dom";

const AppRouter = () => {
    const [isAuth, setIsAuth] = useState(false);
    const routes = [
        { path: "/login", component: <Login/> },
        { path: "/register", component: <Register/> },
        { path: "/welcome", component: <Welcome/> },
        { path: "/recommendations", component: <Recommendations/> },
        { path: "/mybooks", component: <MyBooks/> },
    ]
    
    return (
        isAuth
            ?
            <Routes>
                {routes.map(route =>
                    <Route
                        path={route.path}
                        element={route.component}
                        key={route.path}
                    />
                )}
            </Routes>
            :
            <Routes>
                <Route path="/login" element={<Login/>}/>
            </Routes>
    );
}

export default AppRouter;