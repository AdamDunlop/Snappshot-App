import React from 'react';

class Login extends React.Component {
	render() {
		return (
			<div>
				<p>{'Email'}</p>
				<input type={'email'} />
				<p>{'Password'}</p>
				<input type={'password'} />
			</div>
		);
	}
}

export default Login;