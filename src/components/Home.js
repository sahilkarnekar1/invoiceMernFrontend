import React from 'react'
import SellerForm from './SellerForm'
import ItemForm from './ItemForm'

import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <div className='width-100'>
      <div className='mt-3'>
        <Link to="/invoices">
            <button type="button" className=" m-1 btn btn-secondary">Go to Invoice List</button>
          </Link>
          <Link to="/orderForm">
            <button type="button" className="m-1  btn btn-secondary">Order Form</button>
          </Link>
        </div>
        <SellerForm/>
      
        <ItemForm/>


       
      </div>
    </>
  )
}

export default Home
