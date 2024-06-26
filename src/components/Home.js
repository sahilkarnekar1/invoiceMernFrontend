import React from 'react'
import SellerForm from './SellerForm'
import ItemForm from './ItemForm'
import OrderForm from './OrderForm'

const Home = () => {
  return (
    <>
      <div className='width-100'>
        <SellerForm/>
      
        <ItemForm/>
        <Link to="/invoices">
            <button type="button" className="btn btn-secondary">Go to Invoice List</button>
          </Link>
          <Link to="/orderForm">
            <button type="button" className="btn btn-secondary">Order Form</button>
          </Link>
        
      </div>
    </>
  )
}

export default Home
