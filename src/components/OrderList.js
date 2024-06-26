import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewInvoice = (order) => {
    navigate('/invoice', { state: { order } });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Order List</h1>
      <ul className="list-group">
        {orders.map((order) => (
          <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{order.orderNo}</h5>
              <p className="mb-0">{order.orderDate}</p>
            </div>
            <button className="btn btn-primary" onClick={() => handleViewInvoice(order)}>View Invoice</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
