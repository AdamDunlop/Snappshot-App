import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import Login from './components/Login';
import NoMatch from './components/NoMatch';

class App extends React.Component {
	render() {
		return <div>
			<h1>{'Hello React!'}</h1>
			<p><Link to={"/login"}>{'login'}</Link></p>
            {this.props.children}
		</div>;
	}
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
        <Route path="login" component={Login} />
        <Route path="*" component={NoMatch} />
    </Route>
  </Router>
), document.getElementById('container'));