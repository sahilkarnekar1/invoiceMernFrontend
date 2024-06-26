import React, { useState, useEffect } from 'react';
import { createOrder, getSellers, getItems } from '../services/api';
import { Link } from 'react-router-dom';

const OrderForm = () => {
  const [order, setOrder] = useState({
    orderNo: '',
    orderDate: '',
    seller: '',
    billingDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      stateCode: '',
    },
    shippingDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      stateCode: '',
    },
    placeOfSupply: '',
    placeOfDelivery: '',
    invoiceDetails: {
      invoiceNo: '',
      invoiceDate: '',
    },
    reverseCharge: false,
    items: [],
  });

  const [sellers, setSellers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [unitPrices, setUnitPrices] = useState({});
  const [calculatedFields, setCalculatedFields] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const sellerData = await getSellers();
      setSellers(sellerData.data);
      const itemData = await getItems();
      setItems(itemData.data);
      const prices = {};
      itemData.data.forEach(item => {
        prices[item._id] = item.unitPrice;
      });
      setUnitPrices(prices);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length === 1) {
      setOrder({ ...order, [name]: value });
    } else {
      setOrder(prevState => {
        const newState = { ...prevState };
        let nestedState = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          nestedState = nestedState[keys[i]];
        }
        nestedState[keys[keys.length - 1]] = value;
        return newState;
      });
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index][name] = value;
    setSelectedItems(newSelectedItems);

    const item = newSelectedItems[index];
    const unitPrice = unitPrices[item.item];
    const quantity = item.quantity ? parseFloat(item.quantity) : 0;
    const discount = item.discount ? parseFloat(item.discount) : 0;
    const shippingCharges = item.shippingCharges ? parseFloat(item.shippingCharges) : 0;
    const netAmount = (unitPrice * quantity) - discount + shippingCharges;

    const placeOfSupply = order.placeOfSupply;
    const placeOfDelivery = order.placeOfDelivery;

    const taxRate = item.taxRate ? parseFloat(item.taxRate) : 0;
    let sellerTaxRate = 0;
    let buyerTaxRate = 0;

    if (placeOfSupply === placeOfDelivery) {
      sellerTaxRate = taxRate / 2;
      buyerTaxRate = taxRate / 2;
    } else {
      buyerTaxRate = taxRate;
    }

    const buyerTaxAmount = (netAmount * buyerTaxRate) / 100;
    const sellerTaxAmount = (netAmount * sellerTaxRate) / 100;
    const totalAmount = netAmount + buyerTaxAmount;

    const newCalculatedFields = { ...calculatedFields };
    newCalculatedFields[index] = {
      netAmount,
      sellerTaxAmount,
      buyerTaxAmount,
      totalAmount,
    };
    setCalculatedFields(newCalculatedFields);
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { item: '', quantity: '', discount: '', shippingCharges: '', netAmount: '', taxRate: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newSelectedItems = selectedItems.filter((_, i) => i !== index);
    const newCalculatedFields = { ...calculatedFields };
    delete newCalculatedFields[index];

    const adjustedCalculatedFields = {};
    Object.keys(newCalculatedFields).forEach(key => {
      const newKey = key > index ? key - 1 : key;
      adjustedCalculatedFields[newKey] = newCalculatedFields[key];
    });

    setSelectedItems(newSelectedItems);
    setCalculatedFields(adjustedCalculatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newOrder = { 
        ...order, 
        items: selectedItems.map((item, index) => ({
          ...item,
          netAmount: calculatedFields[index].netAmount,
          sellerTaxAmount: calculatedFields[index].sellerTaxAmount,
          buyerTaxAmount: calculatedFields[index].buyerTaxAmount,
          totalAmount: calculatedFields[index].totalAmount,
        })),
        totalFinalAmount: selectedItems.reduce((sum, item, index) => sum + calculatedFields[index].totalAmount, 0)
      };
      await createOrder(newOrder);
      alert('Order created successfully!');
      setOrder({
        orderNo: '',
        orderDate: '',
        seller: '',
        billingDetails: {
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          stateCode: '',
        },
        shippingDetails: {
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          stateCode: '',
        },
        placeOfSupply: '',
        placeOfDelivery: '',
        invoiceDetails: {
          invoiceNo: '',
          invoiceDate: '',
        },
        reverseCharge: false,
        items: [],
      });
      setSelectedItems([]);
      setCalculatedFields({});
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <Link to="/invoices">
            <button type="button" className="m-1 btn btn-secondary">Go to Invoice List</button>
          </Link>
      <h2>Create Order</h2>
      <div className="row">
        <div className="col-md-6">
          <input type="text" className="form-control mb-3" name="orderNo" value={order.orderNo} onChange={handleChange} placeholder="Order No" required />
          <input type="date" className="form-control mb-3" name="orderDate" value={order.orderDate} onChange={handleChange} placeholder="Order Date" required />
          <select className="form-control mb-3" name="seller" value={order.seller} onChange={handleChange} required>
            <option value="">Select Seller</option>
            {sellers.map(seller => (
              <option key={seller._id} value={seller._id}>{seller.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <h3>Billing Details</h3>
          <input type="text" className="form-control mb-3" name="billingDetails.name" value={order.billingDetails.name} onChange={handleChange} placeholder="Name" required />
          <input type="text" className="form-control mb-3" name="billingDetails.address" value={order.billingDetails.address} onChange={handleChange} placeholder="Address" required />
          <input type="text" className="form-control mb-3" name="billingDetails.city" value={order.billingDetails.city} onChange={handleChange} placeholder="City" required />
          <input type="text" className="form-control mb-3" name="billingDetails.state" value={order.billingDetails.state} onChange={handleChange} placeholder="State" required />
          <input type="text" className="form-control mb-3" name="billingDetails.pincode" value={order.billingDetails.pincode} onChange={handleChange} placeholder="Pincode" required />
          <input type="text" className="form-control mb-3" name="billingDetails.stateCode" value={order.billingDetails.stateCode} onChange={handleChange} placeholder="State Code" required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3>Shipping Details</h3>
          <input type="text" className="form-control mb-3" name="shippingDetails.name" value={order.shippingDetails.name} onChange={handleChange} placeholder="Name" required />
          <input type="text" className="form-control mb-3" name="shippingDetails.address" value={order.shippingDetails.address} onChange={handleChange} placeholder="Address" required />
          <input type="text" className="form-control mb-3" name="shippingDetails.city" value={order.shippingDetails.city} onChange={handleChange} placeholder="City" required />
          <input type="text" className="form-control mb-3" name="shippingDetails.state" value={order.shippingDetails.state} onChange={handleChange} placeholder="State" required />
          <input type="text" className="form-control mb-3" name="shippingDetails.pincode" value={order.shippingDetails.pincode} onChange={handleChange} placeholder="Pincode" required />
          <input type="text" className="form-control mb-3" name="shippingDetails.stateCode" value={order.shippingDetails.stateCode} onChange={handleChange} placeholder="State Code" required />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control mb-3" name="placeOfSupply" value={order.placeOfSupply} onChange={handleChange} placeholder="Place of Supply" required />
          <input type="text" className="form-control mb-3" name="placeOfDelivery" value={order.placeOfDelivery} onChange={handleChange} placeholder="Place of Delivery" required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3>Invoice Details</h3>
          <input type="text" className="form-control mb-3" name="invoiceDetails.invoiceNo" value={order.invoiceDetails.invoiceNo} onChange={handleChange} placeholder="Invoice No" required />
          <input type="date" className="form-control mb-3" name="invoiceDetails.invoiceDate" value={order.invoiceDetails.invoiceDate} onChange={handleChange} placeholder="Invoice Date" required />
          <label className="mt-2">
            Reverse Charge:
            <input type="checkbox" className="ml-2" name="reverseCharge" checked={order.reverseCharge} onChange={() => setOrder({ ...order, reverseCharge: !order.reverseCharge })} />
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3>Items</h3>
          {selectedItems.map((orderItem, index) => (
            <div key={index} className="mb-3">
              <select className="form-control mb-2" name="item" value={orderItem.item} onChange={(e) => handleItemChange(index, e)} required>
                <option value="">Select Item</option>
                {items.map(item => (
                  <option key={item._id} value={item._id}>{item.description}</option>
                ))}
              </select>
              <input type="number" className="form-control mb-2" name="quantity" value={orderItem.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" required />
              <input type="number" className="form-control mb-2" name="discount" value={orderItem.discount} onChange={(e) => handleItemChange(index, e)} placeholder="Discount" required />
              <input type="number" className="form-control mb-2" name="shippingCharges" value={orderItem.shippingCharges} onChange={(e) => handleItemChange(index, e)} placeholder="Shipping Charges" required />
              <input type="number" className="form-control mb-2" name="netAmount" value={calculatedFields[index]?.netAmount || ''} placeholder="Net Amount" readOnly />
              <input type="number" className="form-control mb-2" name="taxRate" value={orderItem.taxRate} onChange={(e) => handleItemChange(index, e)} placeholder="Tax Rate" required />
              <input type="number" className="form-control mb-2" name="sellerTaxAmount" value={calculatedFields[index]?.sellerTaxAmount || ''} placeholder="Seller Tax Amount" readOnly />
              <input type="number" className="form-control mb-2" name="buyerTaxAmount" value={calculatedFields[index]?.buyerTaxAmount || ''} placeholder="Buyer Tax Amount" readOnly />
              <input type="number" className="form-control mb-2" name="totalAmount" value={calculatedFields[index]?.totalAmount || ''} placeholder="Total Amount" readOnly />
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveItem(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-primary mb-3" onClick={handleAddItem}>Add Item</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <button type="submit" className="m-1 btn btn-success mr-2">Create Order</button>
          
        </div>
      </div>
    </form>
  );
};

export default OrderForm;
