import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Row, Col, Card, Button, Alert, Container, Spinner, Badge } from 'react-bootstrap'

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [buying, setBuying] = useState(false)
  const [balance, setBalance] = useState('0')

  // Lấy balance tài khoản hiện tại
  const loadBalance = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)
      setBalance(balance)
    }
  }

  const loadMarketplaceItems = async () => {
    try {
      const itemCount = await marketplace.itemCount()
      let loadedItems = []

      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i)
        if (!item.sold) {
          const uri = await nft.tokenURI(item.tokenId)
          const res = await fetch(uri)
          const metadata = await res.json()
          const totalPrice = await marketplace.getTotalPrice(item.itemId)

          loadedItems.push({
            totalPrice,
            itemId: item.itemId.toString(),
            tokenId: item.tokenId.toString(),
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            sold: item.sold.toString(),
          })
        }
      }

      setItems(loadedItems)
      setLoading(false)
    } catch (err) {
      console.error('❌ Error loading items:', err)
      setError('❌ Lỗi khi tải dữ liệu từ smart contract. Vui lòng kiểm tra kết nối hoặc contract.')
      setLoading(false)
    }
  }

  const buyMarketItem = async (item) => {
    const balanceETH = parseFloat(ethers.utils.formatEther(balance))
    const priceETH = parseFloat(ethers.utils.formatEther(item.totalPrice))

    if (balanceETH < priceETH) {
      alert('⚠️ Không đủ ETH để mua NFT này.')
      return
    }

    try {
      setBuying(true)
      const tx = await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
      await tx.wait()
      alert(`✅ Đã mua thành công NFT: ${item.name}`)
      await loadMarketplaceItems()
      await loadBalance()
    } catch (err) {
      console.error(`❌ Giao dịch mua thất bại:`, err)
      alert('❌ Mua thất bại. Đảm bảo bạn kết nối ví và có đủ ETH.')
    } finally {
      setBuying(false)
    }
  }

  useEffect(() => {
    loadMarketplaceItems()
    loadBalance()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
        <h4 className="mx-3">Đang tải NFT từ Marketplace...</h4>
      </div>
    )
  }

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🛍️ NFT Marketplace</h3>
        <Badge pill bg="success">
          Ví hiện tại: {parseFloat(ethers.utils.formatEther(balance)).toFixed(4)} ETH
        </Badge>
      </div>

      {items.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {items.map((item, idx) => (
            <Col key={idx}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img variant="top" src={item.image} style={{ height: '250px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>
                    <strong>Giá:</strong> {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className="d-grid">
                    <Button
                      onClick={() => buyMarketItem(item)}
                      variant="primary"
                      size="lg"
                      disabled={buying}
                    >
                      {buying ? 'Đang xử lý...' : `Mua với ${ethers.utils.formatEther(item.totalPrice)} ETH`}
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <h4>🚫 Hiện không có NFT nào được rao bán.</h4>
        </div>
      )}
    </Container>
  )
}

export default Home
