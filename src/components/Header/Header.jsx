import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavScrollExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary p-3">
      <Container fluid>
      <Navbar.Brand href="/home" className="text-2xl font-bold rounded-full">
  <img src= 'https://media-hosting.imagekit.io/065a5250e9394c77/WhatsApp%20Image%202025-04-18%20at%2014.55.50_2812de02.jpg?Expires=1839581475&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=3RBDwbfokykNLe0e4LQyeLoLgbKZ4qIFc29NVkb46qAYn1vUWrarkaIMrGlOlP4A~gXv5HmL~TwaPtFLKnyHNSSeEOsXonuJwTFFaB~UUNmy0f5ZwdYWdO7Z3YTzKKQ5Lo9tvq~v5BI6QMEyBHVifR3vBXSZ~NRCnV8e1X2CG4wahQbSE5EVAuaEnX149HuOU3X9tiglJjgKU8aB-4UjtwITTxgparhpoJA3jYFHmUaiziqJR8xBzVZsX1TWMmr5xYwy2zmBHILWW6WDeW9vyEkQVphlyaDY-R5EU6wyofHiUpEaopzyM-dyRpbChrgobqwA5P~oKrgnJhgjsSbcsg__'
   className= 'rounded-full object-cover h-15'
   />
</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 ml-5"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            
            <Nav.Link className=" ml-5 text-black font-bold" href="/Home">Home</Nav.Link>
            <Nav.Link className=" ml-5 text-black font-bold" href="/Jobs">Jobs</Nav.Link >
            <Nav.Link className=" ml-5 text-black font-bold"  href="/MyNetworks">
              My Networks
            </Nav.Link>
            <NavDropdown className=" ml-5 text-black font-bold" title="Notifications" id="navbarScrollingDropdown">
              <NavDropdown.Item  href="/messages">Messages</NavDropdown.Item>
              
              <NavDropdown.Item href="/Notifications">
                Notifications
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className=" ml-5 text-black font-bold"  href="/MyProfile">
                Profile
              </NavDropdown.Item>
            </NavDropdown>
            
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 text-green-500 font-bold"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;