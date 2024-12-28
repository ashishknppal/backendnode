import React, { useState, useEffect, useMemo } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import { useNavigate,useParams } from "react-router-dom";
import {
  FaPlusCircle,
  FaTrash,
  FaPenSquare,
  FaTimesCircle,
  FaUser,
  FaShippingFast,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaIdCard,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-dropdown-select";
import { v4 as uuidv4 } from "uuid";

const Invoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [round_off, setround_off] = useState(0.0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedShip_Client, setSelectedShip_Client] = useState(null);
  const [qty, setqty] = useState(1);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [editId, setEditId] = useState(null);
  const [getTaxcode, setTaxcode] = useState([]);
  const [getProduct, setProduct] = useState([]);
  const [getClient, setClient] = useState([]);
  const [shippingChecked, setShippingChecked] = useState(false);
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("invoiceProducts")) || []
  );
  const handleCheckboxChange = (e) => {
    setShippingChecked(e.target.checked);
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get_Client();
    get_product();
    get_taxcode();
    if (id) {
      get_proforma();
    }
  }, [id]);
  const get_Client = async () => {
    try {
      const res = await axios.get(`${endpoint.CLIENT}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setClient(res.data.data);
    } catch (error) {
      console.error("Catch error:", error);
    } finally {
    }
  };
  const get_product = async () => {
    try {
      const res = await axios.get(`${endpoint.PRODUCT}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProduct(res.data);
    } catch (error) {
      console.error(" catch error:", error);
    }
  };
  const get_taxcode = async () => {
    try {
      const res = await axios.get(`${endpoint.TAXCODE}`);
      setTaxcode(res.data.data);
    } catch (error) {
      console.error("users catch error:", error);
    }
  };
  const get_proforma = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${endpoint.PROFORMA_INVOICE_DETAILS}?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      const invoicedata = res.data.data[0];
      
      setLoading(false);
      SetProforma(invoicedata);
    } catch (error) {
      setLoading(false);
      console.error("Catch error:", error);
    }
  };
  const SetProforma = (data) => {
    console.log(data);
   
    setSelectedClient(data.client_id);
    setSelectedShip_Client(data.ship_client_id);
    setInvoiceDate(data.proforma_invoice_date);
  
  };
  const validateInputs = () => {
    if (!selectedClient) {
      toast.error("Select Client");
      return false;
    }
    if (shippingChecked == true && !shipdata) {
      toast.error("Select shipping client data");
      return false;
    }
    if (!invoiceDate) {
      toast.error("Invoice date is required");
      return false;
    }
    if (!dueDate) {
      toast.error("Due date is required");
      return false;
    }
    if (products.length <= 0) {
      toast.error("Please add product");
      return false;
    }
    return true;
  };

  const add_invoice = async () => {
    if (!validateInputs()) return;
    console.log("products", products);
    const formData = new FormData();
    formData.append("client_id", selectedClient.id);
    formData.append("ship_client_id", shipdata.id);
    formData.append("invoice_date", invoiceDate);
    formData.append("due_date", dueDate);
    formData.append("over_all_discount", calculateTotalDiscount());
    formData.append("round_off", round_off);
    formData.append("total_amount", calculateGrandTotal());
    formData.append("products", JSON.stringify(products));
    console.log("form data::::", formData);

    const data = {
      client_id: selectedClient.id,
      ship_client_id: shipdata.id,
      invoice_date: invoiceDate,
      due_date: dueDate,
      over_all_discount: calculateTotalDiscount(),
      round_off: round_off,
      total_amount: calculateGrandTotal(),
      products: products,
    };

    try {
      const res = await axios.post(`${endpoint.PROFORMA_ADD_INVOICE}`, data, {
        headers: {
          "Content-Type": "application/json", 
        },
      });
      console.log("add Client response::::", res);
      toast.success(res.data.message);
      const invoiceId = res.data.invoice.id;
      if (invoiceId) {
        navigate(`/proforma-invoice/${invoiceId}`);
      }
    } catch (error) {
      console.error("add category catch error:", error);
    }
  };
  useEffect(() => {
    try {
      localStorage.setItem("invoiceProducts", JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products to localStorage:", error);
      toast.error("Unable to save products. Please try again.");
    }
  }, [products]);
  const calculateTotal = () => {
    const discountedPrice = price - discount;
    const taxAmount = tax ? (discountedPrice * tax.tax_percent) / 100 : 0;
    return discountedPrice * qty + taxAmount;
  };
  const handleAddOrUpdateProduct = () => {
    if (!selectedProduct) {
      toast.error("Please select a product.");
      return;
    }
    if (qty <= 0) {
      toast.error("qty must be greater than zero.");
      return;
    }
    if (price < 0) {
      toast.error("Price cannot be negative.");
      return;
    }
    const productData = {
      id: editId || uuidv4(),
      product_id: selectedProduct.id,
      qty,
      price,
      discount,
      taxcode_id: tax.id,
      total: calculateTotal(),
    };

    if (editId) {
      const updatedProducts = products.map((item) =>
        item.id === editId ? productData : item
      );
      setProducts(updatedProducts);
      setEditId(null);
      toast.success("Product updated successfully.");
    } else {
      setProducts([...products, productData]);
      toast.success("Product added successfully.");
    }

    setSelectedProduct(null);
    setqty(1);
    setPrice(0);
    setDiscount(0);
    setTax(null);
  };
  console.log("added product in list", products);
  const deleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    toast.success("Product deleted.");
  };
  const shipdata =
    shippingChecked == true ? selectedShip_Client : selectedClient;
  const updateProduct = (product) => {
    const matchedProduct = getProduct.find(
      (p) => p.id === product.selectedProduct.id
    );

    setSelectedProduct(matchedProduct || null);
    setqty(product.qty);
    setPrice(product.price);
    setDiscount(product.discount);
    setTax(product.tax);
    setEditId(product.id);
  };
  const ClientDetails = ({ client }) => (
    <>
      <h6>
        <FaUser />
        {client.name}
      </h6>
      <h6>
        <FaMapMarkerAlt />
        {client.address}, {client.city}, {client.state}, {client.country},
        {client.pincode}
      </h6>
      <h6>
        <FaPhoneAlt />
        {client.mobile}
      </h6>
      <h6>
        <FaIdCard />
        {client.gstin}
      </h6>
    </>
  );
  const calculateSubTotal = () => {
    return products.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.qty,
      0
    );
  };
  const calculateTotalDiscount = () => {
    return products.reduce((acc, item) => acc + parseFloat(item.discount), 0);
  };
  const calculateTotalTax = () => {
    return products.reduce((acc, item) => {
      const taxRate =
        getTaxcode.find((tax) => tax.id === item.taxcode_id)?.tax_percent || 0;
      const itemTotal =
        parseFloat(item.price) * item.qty - parseFloat(item.discount);
      return acc + itemTotal * (taxRate / 100);
    }, 0);
  };
  const calculateGrandTotal = () => {
    const subTotal = calculateSubTotal();
    const totalDiscount = calculateTotalDiscount();
    const totalTax = calculateTotalTax();
    return subTotal - totalDiscount + totalTax + round_off;
  };
  return (
    <div className="container-fluid bg-white invoice p-2">
      <div className="row inv mx-1">
        <div className="col-lg-4 col-md-6 mb-4">
          <h5>
            <FaUser />
            Bill To:
          </h5>
          <Select
            options={getClient}
            style={{ width: "60%" }}
            labelField="name"
            valueField="id"
            searchable={true}
            searchBy="name"
            placeholder="Select Client"
            value={selectedClient ? [selectedClient] : []}
            onChange={(values) => {
              console.log("values", values);
              setSelectedClient(values[0] || null);
            }}
            multi={false}
          />
          {selectedClient && <ClientDetails client={selectedClient} />}
          <div className="d-flex align-items-center mt-2">
            <input
              type="checkbox"
              id="shipping-checkbox"
              style={{ width: "1rem", height: "1rem" }}
              checked={shippingChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="shipping-checkbox" className="ms-2">
              Shipping Address
            </label>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          {shippingChecked ? (
            <>
              <h5>
                <FaShippingFast />
                Ship To:
              </h5>
              <Select
                options={getClient}
                style={{ width: "65%" }}
                labelField="name"
                valueField="id"
                searchable={true}
                searchBy="name"
                placeholder="Select Shipping Client"
                value={selectedShip_Client ? [selectedShip_Client] : []}
                onChange={(values) => {
                  console.log("values", values);
                  setSelectedShip_Client(values[0] || null);
                }}
                multi={false}
              />
              {selectedShip_Client && (
                <>
                  <h6>
                    <FaUser />
                    {selectedShip_Client.name}
                  </h6>
                  <h6>
                    <FaMapMarkerAlt />
                    {selectedShip_Client.address}, {selectedShip_Client.city},
                    {selectedShip_Client.state}, {selectedShip_Client.country},
                    {selectedShip_Client.pincode}
                  </h6>
                  <h6>
                    <FaPhoneAlt />
                    {selectedShip_Client.mobile}
                  </h6>
                  <h6>
                    <FaIdCard />
                    {selectedShip_Client.gstin}
                  </h6>
                </>
              )}
            </>
          ) : (
            selectedClient && (
              <>
                <h5>
                  <FaShippingFast />
                  Ship To:
                </h5>
                <ClientDetails client={selectedClient} />
              </>
            )
          )}
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <h5>
            <FaCalendarAlt />
            Invoice
          </h5>
          <div className="row">
            <div className="col-md-6">
              <label>Invoice Date : </label>
              <input
                type="date"
                placeholder="Invoice date"
                className="form-control"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label>Due Date : </label>
              <input
                type="date"
                placeholder="Due date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* <div className="table-responsive"> */}
      <table className="table table-bordered mx-1 w-100">
        <thead>
          <tr>
            <th>Select Product</th>
            <th>Tax Code</th>
            <th>QTY</th>
            <th>Price (&#8377;)</th>
            <th>Discount (&#8377;)</th>
            <th>Tax (%)</th>
            <th>Total Amt (&#8377;)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: "20%" }}>
              <Select
                options={getProduct}
                labelField="name"
                valueField="id"
                searchable={true}
                searchBy="name"
                placeholder="Select Product"
                value={selectedProduct ? [selectedProduct] : []}
                onChange={(values) => {
                  setSelectedProduct(values[0] || null);
                  setPrice(values[0].price);
                }}
                multi={false}
              />
            </td>
            <td style={{ width: "20%" }}>
              <Select
                options={getTaxcode}
                labelField="code"
                valueField="id"
                searchable={true}
                searchBy="name"
                placeholder="Select Taxcode"
                value={tax ? [tax] : []}
                onChange={(values) => {
                  console.log("values", values);
                  setTax(values[0] || null);
                }}
                multi={false}
              />
            </td>
            <td>
              <label htmlFor="qty" className="visually-hidden">
                qty
              </label>
              <input
                id="qty"
                type="number"
                placeholder="qty"
                className="form-control"
                value={qty}
                onChange={(e) => setqty(parseFloat(e.target.value) || 0)}
                step={1}
                min={1}
              />
            </td>
            <td>
              <label htmlFor="price" className="visually-hidden">
                Price
              </label>
              <input
                id="price"
                type="number"
                placeholder="Price"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                step={0.01}
                min={0}
              />
            </td>
            <td>
              <label htmlFor="discount" className="visually-hidden">
                Discount
              </label>
              <input
                id="discount"
                type="number"
                placeholder="Discount"
                className="form-control"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                step={0.01}
                min={0}
              />
            </td>
            <td>
              <p>
                {tax == undefined && null
                  ? `${tax.code} (${tax.tax_percent}%)`
                  : "0%"}
              </p>
            </td>
            <td>
              <input
                type="number"
                placeholder="Total Amount"
                className="form-control"
                value={calculateTotal().toFixed(2)}
                readOnly
              />
            </td>
            <td>
              {editId ? (
                <>
                  <FaPenSquare
                    role="button"
                    tabIndex="0"
                    onClick={handleAddOrUpdateProduct}
                    title="Update Product"
                    style={{ cursor: "pointer" }}
                  />
                  <FaTimesCircle
                    role="button"
                    tabIndex="0"
                    onClick={() => {
                      // Reset form fields and exit edit mode
                      setSelectedProduct(null);
                      setqty(1);
                      setPrice(0);
                      setDiscount(0);
                      setTax(0);
                      setEditId(null);
                    }}
                    title="Cancel Edit"
                    style={{
                      marginLeft: "10px",
                      color: "red",
                      cursor: "pointer",
                    }}
                  />
                </>
              ) : (
                <FaPlusCircle
                  role="button"
                  tabIndex="0"
                  onClick={handleAddOrUpdateProduct}
                  title="Add Product"
                  style={{
                    cursor:
                      selectedProduct && qty > 0 && price >= 0
                        ? "pointer"
                        : "not-allowed",
                    opacity: selectedProduct && qty > 0 && price >= 0 ? 1 : 0.5,
                  }}
                />
              )}
            </td>
          </tr>
        </tbody>
        <tbody className="mt-3">
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  {getProduct
                    .filter((item) => item.id === product.product_id)
                    .map((item) => item.name)}
                </td>
                <td>
                  {getTaxcode
                    .filter((item) => item.id === product.taxcode_id)
                    .map((item) => item.code)}
                </td>
                <td>{product.qty}</td>
                <td>&#8377; {product.price}</td>
                <td>&#8377; {product.discount.toFixed(2)}</td>
                <td>{product.taxcode_id} %</td>
                <td>&#8377; {product.total.toFixed(2)}</td>
                <td>
                  <FaTrash
                    role="button"
                    tabIndex="0"
                    color="red"
                    onClick={() => deleteProduct(product.id)}
                    title="Delete Product"
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                  <FaPenSquare
                    role="button"
                    tabIndex="0"
                    onClick={() => updateProduct(product)}
                    title="Edit Product"
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No Product Available!
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* </div> */}
      <hr />
      <div className="row mx-1 my-4 w-100 terms-section">
        <div className="col-md-9">
          <h5 className="terms-title">Terms & Conditions</h5>
          <p className="terms-content">
            Please review the terms and conditions before proceeding. All
            payments are non-refundable, and applicable taxes will be charged as
            per the prevailing rates.
          </p>
        </div>
        <div className="col-md-3">
          <h6 className="text-end summary-item">
            Sub Total: &#8377; {calculateSubTotal()}
          </h6>
          <h6 className="text-end summary-item">
            Total Discount: &#8377; {calculateTotalDiscount()}
          </h6>
          <h6 className="text-end summary-item">
            Tax Amount: &#8377; {calculateTotalTax()}
          </h6>
          <hr className="summary-divider" />
          <h6 className="text-end grand-total">
            Grand Total: &#8377; {calculateGrandTotal()}
          </h6>
        </div>
      </div>
      <hr />
      <button className="savebutton" onClick={add_invoice}>
        Save
      </button>
    </div>
  );
};

export default Invoice;
