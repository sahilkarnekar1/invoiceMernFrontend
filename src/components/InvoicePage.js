import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvoiceDialog from './InvoiceDialog';

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return <div>No order data found.</div>;
  }

  return (
    <div>
      <InvoiceDialog order={order} onClose={() => navigate(-1)} />
    </div>
  );
};

export default InvoicePage;
