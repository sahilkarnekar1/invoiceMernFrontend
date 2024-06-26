// src/components/InvoiceDialog.js

import React from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './style1.css';
import numberToWords from '../utils/numberToWords';
import logo from './amazonFianl.jpg';

const InvoiceDialog = ({ order, onClose }) => {
  if (!order) return null;

  // Helper function to safely access nested properties
  const safeGet = (obj, path, defaultValue = 0) => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : defaultValue, obj);
  };

  const totalFinalAmount = safeGet(order, ['totalFinalAmount'], 0).toFixed(2);

  const handleDownload = async () => {
    const input = document.getElementById('invoiceContent');
    
    // Calculate the height of the entire content
    const canvas = await html2canvas(input, {
      scale: 2, // Increase the scale to improve resolution
      useCORS: true, // Allow cross-origin images
    });
    const imgData = canvas.toDataURL('image/png');
  
    // Set the desired width
    const desiredWidth = 600; // Adjust this value to your desired width
    const aspectRatio = canvas.height / canvas.width;
    const imgWidth = desiredWidth;
    const imgHeight = desiredWidth * aspectRatio;
  
    // Create a new PDF with dimensions matching the content
    const pdf = new jsPDF('p', 'px', [imgWidth, imgHeight]); // Using 'px' unit to match with canvas dimensions
  
    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice_${order.orderNo}.pdf`);
  };
  

  return (
    <>
    <div>
      <div id="invoiceContent" className="container11">
        <div className="header11">
          <img src={logo} alt="Amazon Logo" className="logo11" />
          <div>
            <h4>Tax Invoice/Bill of Supply/Cash Memo</h4>
            <p>(Original for Recipient)</p>
          </div>
        </div>

        <div className="sub">
          <div className="c1">
            <div className="seller-info">
              <h6>Sold By:</h6>
              <p>{safeGet(order, ['seller', 'name'], 'N/A')}</p>
              <p>{safeGet(order, ['seller', 'address'], 'N/A')}</p>
              <p>PAN No: {safeGet(order, ['seller', 'panNo'], 'N/A')}</p>
              <p>GST Registration No: {safeGet(order, ['seller', 'gstRegistrationNo'], 'N/A')}</p>
            </div>
            <div className="order-info">
              <h6>Order Number:</h6>
              <p>{order.orderNo}</p>
              <h6>Order Date:</h6>
              <p>{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="c11">
            <div className="billing-address">
              <h6>Billing Address:</h6>
              <p>{safeGet(order, ['billingDetails', 'name'], 'N/A')}</p>
              <p>{safeGet(order, ['billingDetails', 'address'], 'N/A')}</p>
              <p>{safeGet(order, ['billingDetails', 'city'], 'N/A')}, {safeGet(order, ['billingDetails', 'state'], 'N/A')}, {safeGet(order, ['billingDetails', 'pincode'], 'N/A')}, {safeGet(order, ['billingDetails', 'state'], 'N/A')}</p>
              <p>State/UT Code: {safeGet(order, ['billingDetails', 'stateCode'], 'N/A')}</p>
            </div>
            <div className="shipping-address">
              <h6>Shipping Address:</h6>
              <p>{safeGet(order, ['shippingDetails', 'name'], 'N/A')}</p>
              <p>{safeGet(order, ['shippingDetails', 'address'], 'N/A')}</p>
              <p>{safeGet(order, ['shippingDetails', 'city'], 'N/A')}, {safeGet(order, ['shippingDetails', 'state'], 'N/A')}, {safeGet(order, ['shippingDetails', 'pincode'], 'N/A')}, {safeGet(order, ['shippingDetails', 'state'], 'N/A')}</p>
              <p>State/UT Code: {safeGet(order, ['shippingDetails', 'stateCode'], 'N/A')}</p>
            </div>
            <div>
              <h6>Place of supply: <span>{order.placeOfSupply}</span></h6>
              <h6>Place of delivery: <span>{order.placeOfDelivery}</span></h6>
            </div>
            <div className="invoice-info">
              <h6>Invoice Number:</h6>
              <p>{safeGet(order, ['invoiceDetails', 'invoiceNo'], 'N/A')}</p>
              <h6>Invoice Date:</h6>
              <p>{new Date(order.invoiceDetails.invoiceDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Net Amount</th>
                <th>Tax Rate</th>
                <th>Tax Amount</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((orderItem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <p>{safeGet(orderItem, ['item', 'description'], 'N/A')}</p>
                    {orderItem.shippingCharges && <p>Shipping charges</p>}
                  </td>
                  <td>
                    <p>{safeGet(orderItem, ['item', 'unitPrice'], 0).toFixed(2)}</p>
                    {orderItem.shippingCharges && <p>{orderItem.shippingCharges.toFixed(2)}</p>}
                  </td>
                  <td>{orderItem.quantity}</td>
                  <td>
                    <p>{orderItem.netAmount.toFixed(2)}</p>
                    {orderItem.shippingCharges && <p>{orderItem.shippingCharges.toFixed(2)}</p>}
                  </td>
                  <td>{orderItem.taxRate}%</td>
                  <td>{orderItem.buyerTaxAmount.toFixed(2)}</td>
                  <td>{orderItem.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="7"> <b> Total</b></td>
                <td><b>{totalFinalAmount}</b></td>
              </tr>
              <tr>
                <td colSpan="8"><b>Amount In Words: </b><p>{numberToWords(parseFloat(totalFinalAmount))}</p></td>
              </tr>
            </tbody>
          </table>
          <div className="sign">
            <p>{safeGet(order, ['seller', 'name'], 'N/A')}</p>
            <div className="pSignature">
              <p>Signature</p>
            </div>
            <p>Authorized Signatory</p>
          </div>
        </div>

        <p>Whether tax is payable under reverse charge - {order.reverseCharge ? "Yes" : "No"}</p>
      </div>
      <button className='btnsetcolordark' onClick={onClose}>Close</button>
      <button className='btndownload' onClick={handleDownload}>Download PDF</button>
      </div>
   </>
  );
};

export default InvoiceDialog;
