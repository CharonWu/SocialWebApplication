import logo from './logo.svg';
import './App.css';
import Landing from "./Landing";
import ProfileView from "./Profile";
import MainPageView from "./MainPageView";
import MyRouter from "./Router";
import React from "react";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <MyRouter/>
                {/*<Landing/>*/}
                {/*<ProfileView/>*/}
                {/*<MainPageView/>*/}
            </header>
        </div>
    );
}

export default App;
