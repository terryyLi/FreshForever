import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const NavBar: React.FC = () => {

  return (
    <Navbar bg="light" expand="lg" className="navbar-expand shadow-sm">
      <div className='px-5 py-2'>
        <Navbar.Brand href="#">
            <img
              src={require("../assets/logo_with_text.svg").default}
              height="60"
              className="d-inline-block align-top"
              alt="My App Logo"
            />{' '}
        </Navbar.Brand>
      </div>
      <div>
      <a className="btn-lg py-4" href='https://youtu.be/doQwC2c_Di4' target="_blank" rel="noopener noreferrer">New to Fresh Forever? Click For Video Tutorial!</a>
      </div>
    </Navbar>
  );
};

export default NavBar;
