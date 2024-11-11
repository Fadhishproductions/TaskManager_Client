import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../Components/FormContainer';
import { useLoginMutation } from '../slices/apiSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { error, isLoading }] = useLoginMutation();

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        email,
        password,
      }).unwrap();
      dispatch(setCredentials(response));
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <FormContainer>
      <div className="container" style={{ maxWidth: '400px' }}>
        <h2 className="text-center">Login</h2>
        {error && (
          <div className="alert alert-danger">
            {error?.data?.message || 'An error occurred during login.'}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group position-relative">
            <label>Password</label>
            <div className='input-group'>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              style={{ textDecoration: 'none' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-3">
            Create an account - <Link to="/Register">Register</Link>
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
