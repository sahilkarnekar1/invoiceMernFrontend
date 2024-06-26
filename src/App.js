import React from 'react';


import { Routes, Route } from "react-router-dom"

import Home from './components/Home';
import OrderList from './components/OrderList';
import InvoicePage from './components/InvoicePage';
import OrderForm from './components/OrderForm';


const App = () => {
  return (
    <div>
   
<Routes>
<Route path="/" element={ <Home/> } />
<Route path="/invoices" element={ <OrderList/> } />
<Route path="/invoice" element={<InvoicePage/>} />
<Route path="/orderForm" element={<OrderForm/>} />
</Routes>



    </div>
  );
};

export default App;
