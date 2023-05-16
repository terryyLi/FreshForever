import React from 'react';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from "react-router-dom";

import NavBar from '../components/NavBar';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  }

  return (
    <div>
      <NavBar />
      <Container>
        <Container className="p-5 text-center">
          <Container className="p-4 mt-5">
            <div><h1>Keep You Food Fresh, Never Let Them Cry</h1></div>
          </Container>
          <Container className="p-2">
            <div><h3>Be your best refrigerator manager!</h3></div>
          </Container>
          <Container className='mt-4 p-3'>
            <Button onClick={handleSignUpClick} className='sign-in-btn rounded-1 border-0 py-3 px-5 btn-lg mt-5'>Sign up for free</Button>
          </Container>
          <Container className='my-4 px-4 pt-4 pb-5'>
            <div><h3 className='text-decoration-underline'><Link to="/signin" className='text-dark'>Already have an account? Log in</Link></h3></div>
          </Container>
        </Container>
      </Container>
    </div>
  )
}

export default LandingPage;