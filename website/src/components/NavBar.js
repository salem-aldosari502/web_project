import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Personal_Photo from "../images/Personal_Photo.png"
import Hero_Background from "../images/Hero_Background.png"

function Navigation({ setShowAI, user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setUser(null);
        navigate('/login');
    };

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
                            <NavDropdown align="end" title={<Image src={Personal_Photo} roundedCircle width={34} height={34} />}>
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
