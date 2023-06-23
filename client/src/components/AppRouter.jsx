import React from "react";

import Login from '../pages/Login';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import Recommendations from '../pages/Recommendations';
import MyBooks from '../pages/MyBooks';
import {Route, Routes} from "react-router-dom";


const AppRouter = () => {

    const routes = [
        {path: "/login", component: <Login/>},
        {path: "/register", component: <Register/>},
        {path: "/welcome", component: <Welcome/>},
        {path: "/recommendations", component: <Recommendations/>},
        {path: "/mybooks", component: <MyBooks/>},
    ]

    return (
        <Routes>
            {routes.map(route =>
                <Route
                    path={route.path}
                    element={route.component}
                    key={route.path}
                />
            )}
        </Routes>
    );
}

export default AppRouter;
