import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {

    const { userInfo } = useSelector((state) => state.auth);
    
  return (
    <Container className="mt-5">
      <Row className="text-center">
        <Col>
          <h1>Welcome {userInfo?.username} to Task Manager</h1>
          
          <p className="lead mt-3">
            Manage your tasks efficiently and stay organized with our simple, intuitive task management application.
          </p>
          {!userInfo ? (
            <div className="mt-4">
            <Link to="/login">
              <Button variant="primary" size="lg" className="m-2">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="m-2">Register</Button>
            </Link>
          </div>
          ) : ('')}
          
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <div className="p-4 border rounded text-center">
            <h3>Easy Task Management</h3>
            <p>
              Add, edit, and manage your tasks with ease. Our user-friendly interface helps you stay productive.
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="p-4 border rounded text-center">
            <h3>Track Your Progress</h3>
            <p>
              Visualize your progress and stay motivated. Our built-in statistics and charts keep you on track.
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="p-4 border rounded text-center">
            <h3>Secure & Reliable</h3>
            <p>
              Your data is secure with us. We ensure reliability so you can focus on what matters most.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
