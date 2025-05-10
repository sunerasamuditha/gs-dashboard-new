import React, { useState, useEffect } from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import './Navbar.css';

function CustomNavbar({ theme, toggleTheme }) {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <Navbar
      bg="white"
      variant="light"
      expand="lg"
      fixed="top"
      className={`navbar ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}
    >
      <Navbar.Brand href="https://sasnaka.org/" style={{ color: '#0098da' }}>
        <img src="/images/sasnaka.png" alt="Sasnaka Logo" className="logo" />
        <img src="/images/ganithasaviya.png" alt="Ganitha Saviya Logo" className="logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="#home" style={{ color: 'black', fontWeight:500 }}>Home</Nav.Link>
          <Nav.Link href="#map" style={{ color: 'black', fontWeight:500 }}>Map</Nav.Link>
          <Nav.Link href="#about" style={{ color: 'black', fontWeight:500 }}>About</Nav.Link>
          <Nav.Link href="https://docs.google.com/spreadsheets/d/1ibD6_zCrzmDk4Wt3wbpVyy6msr2hJjZVzDdw_fPv8pQ/edit?resourcekey=&gid=1265241927#gid=1265241927" style={{ color: 'black', fontWeight:500 }}>Legacy Dashboard</Nav.Link>
          

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;

/*<Button
            onClick={toggleTheme}
            style={{
              backgroundColor: '#0098da',
              borderColor: '#0098da',
              color: 'white',
            }}
            className="theme-toggle-btn"
          >
            {theme === 'light' ? 'Day' : 'Night'}
          </Button>*/