import React, { Fragment, useState } from "react";
import axios from "axios";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import About from "./components/pages/About";
import User from "./components/users/User";

import GithubState from "./context/github/GithubState";

const App = () => {
  const [users, setUSers] = useState([]);
  const [user, setUSer] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const searchUsers = async (text) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&
      client_id=${process.env.REACT_APP_GITHUB_CLEINT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLEINT_SECRET}`
    );

    setUSers(res.data.items);
    setLoading(false);
  };

  const clearUsers = () => {
    setUSers([]);
    setLoading(false);
  };

  const getUser = async (userName) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${userName}?
      client_id=${process.env.REACT_APP_GITHUB_CLEINT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLEINT_SECRET}`
    );

    setUSer(res.data);
    setLoading(false);
  };

  const getUserRepos = async (userName) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${userName}/repos?per_page=5&sort=created:asc&
      client_id=${process.env.REACT_APP_GITHUB_CLEINT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLEINT_SECRET}`
    );

    setRepos(res.data);
    setLoading(false);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <GithubState>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={searchUsers}
                      clearUsers={clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={showAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={getUser}
                    getUserRepos={getUserRepos}
                    repos={repos}
                    user={user}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
