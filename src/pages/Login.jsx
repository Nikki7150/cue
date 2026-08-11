import { useEffect, useState } from 'react';

const Login = () => {

    return (
        <div className="login">
            {user ? <p>Welcome, {user.email}!</p> : <h1>Login</h1>}
        </div>
    );
};

export default Login;