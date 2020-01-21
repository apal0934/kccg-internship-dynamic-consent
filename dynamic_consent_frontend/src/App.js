import { Route, HashRouter as Router, Switch } from "react-router-dom";

import AddUser from "./Pages/User/AddUser";
import Header from "./Components/Header";
import Landing from "./Pages/Landing";
import React from "react";
import User from "./Pages/User/User";
import Users from "./Pages/User/Users";

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/user/list" component={Users} />
                    <Route exact path="/user/add" component={AddUser} />
                    <Route path="/user/:id" component={User} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
