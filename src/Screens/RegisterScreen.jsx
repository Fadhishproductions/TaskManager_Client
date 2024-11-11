import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../slices/authSlice';
import FormContainer from '../Components/FormContainer';
import { useRegisterMutation } from '../slices/apiSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [register, { error, isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be at least 6 characters long, include 1 special character, and 1 number');
      return;
    }

    try {
      const response = await register({
        username: name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials(response));
      navigate('/'); // Redirect to dashboard upon successful registration
    } catch (error) {
      console.error('Error registering:', error);
      setMessage(
        error?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <FormContainer>
      <div className="container" style={{ maxWidth: '400px' }}>
        <h2 className="text-center">Register</h2>
        {message && <div className="alert alert-warning">{message}</div>}
        {error && (
          <div className="alert alert-danger">
            {error?.data?.message || 'An error occurred during registration.'}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
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
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <div className='container-fluid mt-3'>
            If you have an account, click here - <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;
