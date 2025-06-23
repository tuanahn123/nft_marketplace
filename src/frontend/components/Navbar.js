import { Link } from 'react-router-dom'
import { Navbar, Nav, Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
  const shortenAddress = (addr) =>
    addr ? addr.slice(0, 6) + '...' + addr.slice(addr.length - 4) : ''

  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      className="shadow-sm sticky-top"
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000,
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold">
          <img src={market} width="40" height="40" alt="logo" className="me-2" />
          KMA Marketplace
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto fw-semibold">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/create">Tạo NFT</Nav.Link>
            <Nav.Link as={Link} to="/my-listed-items">NFT của tôi</Nav.Link>
            <Nav.Link as={Link} to="/my-purchases">Đã mua</Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {account ? (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip>
                    {account}
                  </Tooltip>
                }
              >
                <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2"
                >
                  <Button variant="outline-light" className="text-nowrap">
                    🦊 {shortenAddress(account)}
                  </Button>
                </Nav.Link>
              </OverlayTrigger>
            ) : (
              <Button
                onClick={web3Handler}
                variant="light"
                className="fw-bold text-dark px-4 py-2 rounded-pill"
              >
                Kết nối ví
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
