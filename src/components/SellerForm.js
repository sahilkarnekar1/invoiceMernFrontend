import React, { useState } from 'react';
import { createSeller } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const SellerForm = () => {
  const [seller, setSeller] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panNo: '',
    gstRegistrationNo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeller({ ...seller, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSeller(seller);
      alert('Seller created successfully!');
      setSeller({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        panNo: '',
        gstRegistrationNo: '',
      });
    } catch (error) {
      console.error('Error creating seller:', error);
      alert('Failed to create seller');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Invoice Application</h1>
      <h2 className="mb-4">Create Seller</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={seller.name} onChange={handleChange} placeholder="Name" required />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" name="address" value={seller.address} onChange={handleChange} placeholder="Address" required />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input type="text" className="form-control" id="city" name="city" value={seller.city} onChange={handleChange} placeholder="City" required />
        </div>
        <div className="mb-3">
          <label htmlFor="state" className="form-label">State</label>
          <input type="text" className="form-control" id="state" name="state" value={seller.state} onChange={handleChange} placeholder="State" required />
        </div>
        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <input type="text" className="form-control" id="pincode" name="pincode" value={seller.pincode} onChange={handleChange} placeholder="Pincode" required />
        </div>
        <div className="mb-3">
          <label htmlFor="panNo" className="form-label">PAN No</label>
          <input type="text" className="form-control" id="panNo" name="panNo" value={seller.panNo} onChange={handleChange} placeholder="PAN No" required />
        </div>
        <div className="mb-3">
          <label htmlFor="gstRegistrationNo" className="form-label">GST Registration No</label>
          <input type="text" className="form-control" id="gstRegistrationNo" name="gstRegistrationNo" value={seller.gstRegistrationNo} onChange={handleChange} placeholder="GST Registration No" required />
        </div>
        <button type="submit" className="btn btn-primary">Create Seller</button>
      </form>
    </div>
  );
};

export default SellerForm;
