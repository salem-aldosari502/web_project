import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Hero_Background from "../images/Hero_Background.png"
import { useAuth } from "../context/AuthContext";
import Default_Avatar from "../images/Default_Avatar.png";

function Navigation({ setShowAI, user, setUser }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [avatarSrc, setAvatarSrc] = useState(null);

    useEffect(() => {
      const storedUserStr = localStorage.getItem('user');
      let avatarFromUser = null;
      if (storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          avatarFromUser = storedUser.avatar || null;
        } catch (e) {
          console.warn('Failed to parse stored user');
        }
      }
      
      // Fallback to profile avatar (set on change)
      const savedAvatar = localStorage.getItem(`profileAvatar_${user?.id}`);
      const avatarToSet = avatarFromUser || savedAvatar || null;
      
      if (avatarToSet) {
        setAvatarSrc(avatarToSet);
      }
    }, [user?.id]);


    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/home');
    };

    const avatarUrl = avatarSrc || Default_Avatar;

    return (<>
        <Navbar bg="dark" variant="dark" expand="lg" className="py-2">
            <Nav className="gap-image">
            <Image src={Hero_Background} roundedCircle width={34} height={34} />
            <Nav.Link onClick={() => setShowAI(true)}>Ask AI</Nav.Link>
            </Nav>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-3">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/aboutus">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/contactus">Contact Us</Nav.Link>
                    </Nav>
                    {user ? (
                        <Nav>
                            <NavDropdown align="end" title={<Image src={avatarUrl} roundedCircle width={34} height={34} />}>
                                <NavDropdown.Item><Nav.Link as={Link} to='/profile' style={{color: "#212529"}}>Profile</Nav.Link></NavDropdown.Item>
                                <NavDropdown.Item><Nav.Link as={Link} to='/settings' style={{color: "#212529"}}>Settings</Nav.Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to='/login'> Login </Nav.Link>
                            <Nav.Link as={Link} to='/signup'> Sign Up</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>);
}

export default Navigation;
