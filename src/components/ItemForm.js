import React, { useState } from 'react';
import { createItem } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const ItemForm = () => {
  const [item, setItem] = useState({
    description: '',
    unitPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem(item);
      alert('Item created successfully!');
      setItem({
        description: '',
        unitPrice: '',
      });
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name="description" value={item.description} onChange={handleChange} placeholder="Description" required />
        </div>
        <div className="mb-3">
          <label htmlFor="unitPrice" className="form-label">Unit Price</label>
          <input type="number" className="form-control" id="unitPrice" name="unitPrice" value={item.unitPrice} onChange={handleChange} placeholder="Unit Price" required />
        </div>
        <button type="submit" className="btn btn-primary">Create Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
