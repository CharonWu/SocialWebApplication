import React from "react";

import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./MainPageView";
import {Profile} from "./Profile";
import {LandingView} from "./Landing";


const MyRouter =()=>(

    <BrowserRouter>
        <Routes>
            <Route exact path={"/"} element={<LandingView/>} />
            <Route exact path={"/main"} element={<MainPage/>} />
            <Route exact path={"/profile"} element={<Profile/>} />
        </Routes>
    </BrowserRouter>

);

export default MyRouter
