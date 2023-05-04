import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image'
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

//I decided to build everything within App.js for this question to keep things simple

function SaleModal(props) {
  let sellingPrice = props.info.salePriceCents * 0.01;
  let commission = Math.round((props.info.commissionRateBips / 10000) * (props.info.salePriceCents * 0.01));
  let sellerFee = props.info.sellerFeeCents * 0.01;
  let earnings = sellingPrice - commission - sellerFee;

  const [Accept, setAccept] = useState('')
  const [Reject, setReject] = useState('')


  async function handleAcceptSale() {
    try {
      let result = await axios.post('https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/123/accept');
      setAccept(result);
      console.log(Accept);
      props.onHide();
    } catch(e) {
      console.log(e);
    }
  }

  async function handleRejectSale() {
    try {
      let result = await axios.post('https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/123/decline');
      setReject(result);
      console.log(Reject);
      props.onHide();
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <div className='leftmodal'>
          <h4>Congrats!</h4> 
          <h4>Your watch sold!</h4>
          <p>
            You have 1 business day to accept the sale. If you do not accept, it will be automatically rejected.
          </p>
          <Button style={{ fontWeight: '700', backgroundColor: '#1a3a32', borderRadius: '25px', width: '300px', height: '70px', marginBottom: '10px' }} variant='success' onClick={handleAcceptSale}>
            Accept Sale
          </Button>
          <Button style={{ fontWeight: '700', borderRadius: '25px', width: '300px', height: '70px' }} variant='outline-success' onClick={handleRejectSale}>
            Reject Sale
          </Button>
        </div>
        <div className='rightmodal'>
          <h4>{props.info.listing.model.brand.name} {props.info.listing.model.name}</h4>
          <h5>{props.info.listing.condition} / {props.info.listing.manufactureYear}</h5>
          <Image style={{width: '100px'}} src={props.info.listing.images[0].image.url} rounded='true'/>
          <hr/>
          <h5>Selling Price ${sellingPrice}</h5>
          <h5>Level 1 Commission (8.5%) -${commission}</h5>
          <h5>Seller Fee -${sellerFee}</h5>
          <hr/>
          <h4>Earnings ${earnings}</h4>

        </div>
      </Modal.Body>
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = useState(false);
  const [watchInfo, setWatchInfo] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await axios.get('https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/123');
        setWatchInfo(data);
        setLoading(false);
        setError(false);
      } catch(e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, [])

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  else if (error){
    return (
      <div>
        <h2>404 Not Found</h2>
      </div>
    );
  } else{
    return (
      <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
        <div style={{ width: "50%" }}>
          <Image style={{border: '1px solid gray', display: 'block', margin: '0 auto', width: '100%'}} src={watchInfo.listing.images[0].image.url} rounded='true'/>
        </div>
        <div style={{ width: "50%", marginLeft: '50px'  }}>
          <h1>{watchInfo.listing.manufactureYear} {watchInfo.listing.model.brand.name} {watchInfo.listing.model.name}</h1>
          <hr/>
          <div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
              <h3>CONDITION</h3>
              <p>{watchInfo.listing.condition ? watchInfo.listing.condition : "N/A"}</p>
            </div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
              <h3>BOX</h3>
              <p>{watchInfo.listing.box ? watchInfo.listing.box : "N/A"}</p>
            </div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
              <h3>PAPERS</h3>
              <p>{watchInfo.listing.papers ? watchInfo.listing.papers : "N/A"}</p>
            </div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
              <h3>YEAR</h3>
              <p>{watchInfo.listing.manufactureYear ? watchInfo.listing.manufactureYear : "N/A"}</p>
            </div>
            <div style={{ display: 'inline-block', marginRight: '20px' }}>
              <h3>CASE SIZE</h3>
              <p>{watchInfo.listing.caseSize ? watchInfo.listing.caseSize : "N/A"}</p>
            </div>
            <hr/>
          </div>
          <div>
            <Button style={{ fontWeight: '700', backgroundColor: '#1a3a32', borderRadius: '25px', width: '300px', height: '70px', marginRight: '15px' }} variant='success' onClick={() => setModalShow(true)}>
              Accept Sale
            </Button>
            <Button style={{ fontWeight: '700', borderRadius: '25px', width: '300px', height: '70px' }} variant='outline-success' onClick={() => setModalShow(true)}>
              Reject Sale
            </Button>
          </div>
          <div style={{ marginTop: '50px', marginRight: '50px'}}>
            <h3>The Story</h3>
            <p>{watchInfo.listing.model.description}</p>
          </div>
        </div>
        <SaleModal show={modalShow} info={watchInfo} onHide={() => setModalShow(false)} />
      </div>
    );
          
  }
}

export default App;
