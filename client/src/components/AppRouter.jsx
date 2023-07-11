import React, {useContext} from "react";
import Login from '../pages/Login';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import Recommendations from '../pages/Recommendations';
import MyBooks from '../pages/MyBooks';
import Loader from "./UI/Loader/Loader";
import {Navigate, Route, Routes} from "react-router-dom";
import {AuthContext} from "../context";


const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    const privateRoutes = [
        {path: "/welcome", component: <Welcome/>},
        {path: "/recommendations", component: <Recommendations/>},
        {path: "/mybooks", component: <MyBooks/>},
        {path: "*", component: <Navigate to='/recommendations'/>},
    ]
    const publicRoutes = [
        {path: "/login", component: <Login/>},
        {path: "/register", component: <Register/>},
        {path: "*", component: <Navigate to='/login' replace={true}/>},
    ]
    if (isLoading)
        return <Loader/>

    return (
        isAuth
            ?
            <Routes>
                {privateRoutes.map(route =>
                    <Route path={route.path} element={route.component} key={route.path}/>
                )}
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route =>
                    <Route path={route.path} element={route.component} key={route.path}/>
                )}
            </Routes>
    )

}

export default AppRouter;
