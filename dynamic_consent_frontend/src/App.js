import { Route, HashRouter as Router, Switch } from "react-router-dom";

import AddUser from "./Pages/User/AddUser";
import Header from "./Components/Header";
import Landing from "./Pages/Landing";
import React from "react";
import User from "./Pages/User/User";
import Users from "./Pages/User/Users";

function App() {
    const API_IP = "172.21.78.131";

    return (
        <div className="App">
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route
                        exact
                        path="/user/list"
                        render={() => <Users IP={API_IP} />}
                    />
                    <Route
                        exact
                        path="/user/add"
                        render={() => <AddUser IP={API_IP} />}
                    />
                    <Route path="/user/:id" component={User} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
