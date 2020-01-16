import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./Components/Header";
import Users from "./Pages/User/Users";
import User from "./Pages/User/User";
import AddUser from "./Pages/User/AddUser";
import Consents from "./Pages/Consent/Consents";
import Landing from "./Pages/Landing";

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
                    <Route path="/consents" component={Consents} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
