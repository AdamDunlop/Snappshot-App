// import Greeting from './models/Greeting';
// import DateTime from './models/DateTime';
 
// var h1 = document.querySelector('h1');
// h1.textContent = new Greeting();
 
// var h2 = document.querySelector('h2');
// h2.textContent = new DateTime();

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
	render() {
		return <div>
			<h1>{'Hello React!'}</h1>
		</div>;
	}
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);