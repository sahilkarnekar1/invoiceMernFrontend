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
       
        <OrderForm/>
      </div>
    </>
  )
}

export default Home
