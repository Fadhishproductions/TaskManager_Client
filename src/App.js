import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Header from './Components/Header';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen'
import Dashboard from './Screens/Dashboard';
import HomePage from './Screens/HomePage';
import ProtectedRoute from './Components/ProtectedRoute';
function App() {

   
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/home' element={
                <ProtectedRoute>
                  <HomePage/>
                </ProtectedRoute>  
           }/>
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen/>} />
      </Routes> 
      
    </Router>
  );
}

export default App;
