import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { Row, Form, Button, Spinner, Alert, Container, Col, Card } from 'react-bootstrap'
import axios from 'axios'

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [preview, setPreview] = useState('')
  const [price, setPrice] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const uploadToPinata = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(url, formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      })
      const hash = res.data.IpfsHash
      const fullUrl = `https://gateway.pinata.cloud/ipfs/${hash}`
      console.log('🖼️ Image uploaded:', fullUrl)
      return fullUrl
    } catch (err) {
      console.error('❌ Upload ảnh lỗi:', err)
      setError('❌ Lỗi khi tải ảnh lên Pinata.')
      return null
    }
  }

  const uploadJSONToPinata = async (metadata) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
    try {
      const res = await axios.post(url, metadata, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      })
      const hash = res.data.IpfsHash
      return `https://gateway.pinata.cloud/ipfs/${hash}`
    } catch (err) {
      console.error('❌ Metadata upload lỗi:', err)
      setError('❌ Lỗi khi tải metadata lên Pinata.')
      return null
    }
  }

  const uploadToIPFS = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      const url = await uploadToPinata(file)
      if (url) setImage(url)
    }
  }

  const createNFT = async () => {
    if (!image || !price || !name || !description) {
      setError('❗ Vui lòng điền đầy đủ thông tin và tải ảnh.')
      return
    }

    setError(null)
    setLoading(true)
    const metadata = { image, price, name, description }
    const uri = await uploadJSONToPinata(metadata)
    if (uri) await mintThenList(uri)
    setLoading(false)
  }

  const mintThenList = async (uri) => {
    try {
      const txMint = await nft.mint(uri)
      await txMint.wait()

      const id = await nft.tokenCount()
      const approvalTx = await nft.setApprovalForAll(marketplace.address, true)
      await approvalTx.wait()

      const listingPrice = ethers.utils.parseEther(price.toString())
      const makeItemTx = await marketplace.makeItem(nft.address, id, listingPrice)
      await makeItemTx.wait()

      alert('✅ NFT đã được tạo và niêm yết thành công!')
      resetForm()
      navigate('/')
    } catch (err) {
      console.error('❌ Giao dịch lỗi:', err)
      setError('⚠️ Giao dịch thất bại: ' + (err?.data?.message || err?.message || 'Không rõ lỗi'))
    }
  }

  const resetForm = () => {
    setImage('')
    setPreview('')
    setPrice('')
    setName('')
    setDescription('')
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">Tạo & Niêm yết NFT Mới</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="p-4 shadow">
            <Row className="g-4">
              <Form.Control type="file" accept="image/*" required name="file" onChange={uploadToIPFS} />

              {preview && (
                <div className="text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxHeight: '200px', objectFit: 'contain', marginTop: '10px' }}
                  />
                </div>
              )}
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Tên NFT"
              />
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Mô tả"
              />
              <Form.Control
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Giá (ETH)"
              />
              <div className="d-grid">
                <Button
                  onClick={createNFT}
                  variant="primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang tạo NFT...
                    </>
                  ) : (
                    'Tạo & Niêm yết NFT'
                  )}
                </Button>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Create
