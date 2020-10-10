import React from 'react';
import Authenticate from './pages/Authenticate';
import MainPage from './pages/Main';
import Profile from './pages/Profile'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      {/* <Authenticate /> */}
      {/* <MainPage /> */}
      {/* <Profile /> */}
      <Router>
        <Switch>
          <Route exact path = "/" component = {Authenticate} />
          <Route path = "/main" component = {MainPage} />
          <Route path = "/profile" component = {Profile} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
