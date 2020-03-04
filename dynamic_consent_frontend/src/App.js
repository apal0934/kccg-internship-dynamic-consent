import { Route, HashRouter as Router, Switch } from "react-router-dom";

import AddUser from "./Pages/User/AddUser";
import Header from "./Components/Header";
import Landing from "./Pages/Landing";
import { Layout } from "antd";
import React from "react";
import User from "./Pages/User/User";
import Users from "./Pages/User/Users";

const { Footer } = Layout;

function App() {
    const API_IP = process.env.REACT_APP_BACKEND_IP;

    return (
        <div className="App">
            <Router>
                <Layout style={{ backgroundColor: "white" }}>
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
                    <Footer
                        style={{
                            textAlign: "center",
                            backgroundColor: "white"
                        }}
                    >
                        Proof of Concept Only
                    </Footer>
                </Layout>
            </Router>
        </div>
    );
}

export default App;
