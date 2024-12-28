import React, { useState, useEffect } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPenSquare, FaInfoCircle } from "react-icons/fa";
import * as Image from "../image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-dropdown-select";
import ReactPaginate from "react-paginate";
import { v4 as uuidv4 } from "uuid";

function Invoicelistdata() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [PaymentList, setPaymentList] = useState([]);
  const [InvoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSettingId, setSelectedSettingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [amount, setamount] = useState([]);
  const [pay_ref, setpay_ref] = useState([]);
  const [pay_mode, setpay_mode] = useState(null);
  const [invoice_id, setinvoice_id] = useState(null);
  const [pay_status, setpay_status] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const options = [
        { id: 'credit_card', name: 'Credit Card' },
        { id: 'debit_card', name: 'Debit Card' },
        { id: 'paypal', name: 'Paypal' },
        { id: 'bank_transfer', name: 'Bank Transfer' },
    ];
  useEffect(() => {
    get_Payment(currentPage, searchTerm);
    get_invoice();
  }, [currentPage, searchTerm]);

    const get_Payment = async (page, search = "") => {
        setLoading(true);
        try {
        const res = await axios.get(`${endpoint.PAYMENT}?page=${page}&search=${search}`, {
            headers: {
            "Content-Type": "application/json",
            },
        });
        setPaymentList(res.data.data.data);
        setTotalItems(res.data.data.total);
        } catch (error) {
        console.error("Error fetching payments:", error);
        } finally {
        setLoading(false);
        }
    }; 
    const get_invoice = async () => {
        setLoading(true);
        try {
        const res = await axios.get(`${endpoint.UNPAID_INVOICE}`, {
            headers: {
            "Content-Type": "application/json",
            },
        });
        setInvoiceList(res.data.data);
        } catch (error) {
        console.error("Error fetching payments:", error);
        } finally {
        setLoading(false);
        }
    };

    const validateInputs = () => {
        
        if (!amount) {
        toast.error("Invoice prefix is required.");
        return false;
        }

        return true;
    };

    const Add_payment = async () => {
        if (!validateInputs()) return;
        const data={
          amount: amount,
          pay_ref: pay_ref,
          pay_mode: pay_mode,
          invoice_id:invoice_id,
          pay_status:pay_status
        };
        try {
        const res = await axios.post(`${endpoint.ADD_PAYMENT}`, data, {
            headers: {
            "Content-Type": "multipart/json",
            },
        });
        toast.success(res.data.message);
        resetModalState();
        get_Payment();
        } catch (error) {
        console.error("Error adding setting:", error);
        }
    };

    const update_payment = async () => {
        if (!validateInputs()) return;

        const data={
          amount: amount,
          pay_ref: pay_ref,
          pay_mode: pay_mode,
          invoice_id:invoice_id,
          pay_status:pay_status
        };
        console.log(data);
        try {
        const res = await axios.post(
            `${endpoint.UPDATE_PAYMENT}/${selectedSettingId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast.success(res.data.message);
        resetModalState();
        get_Payment();
        } catch (error) {
        console.error("Error updating setting:", error);
        }
    };

    const delete_Payment = async (obj) => {
        try {
        const res = await axios.delete(`${endpoint.DELETE_PAYMENT}/${obj.id}`);
        toast.success(res.data.message);
        get_Payment();
        } catch (error) {
        console.error("Error deleting payment:", error);
        }
    };
  const updatestate = () => {
    setamount("");
    setpay_ref("");
    closeModal();
  };
  const resetModalState = () => {
    setamount("");
    setpay_ref("");
    setIsEditMode(false);
    setSelectedSettingId(null);
    closeModal();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    resetModalState();
    openModal();
  };
  const openUpdateModal = (item) => {
    setIsEditMode(true);
    setSelectedSettingId(item.id);
    setamount(item.amount);
    setpay_ref(item.ref_no);
    const paymode=options.find(option => option.id === item.pay_mode);
    setpay_mode(paymode? paymode.id : null);
  
    const selectedInvoice = InvoiceList.find(invoice => invoice.id === item.invoice_id);
    setinvoice_id(selectedInvoice ? selectedInvoice.id : null);
  console.log(item.invoice.payment_status);
    setpay_status(item.invoice.payment_status);
    openModal();
  };

  const openModal = () => {
    const modal = document.getElementById("exampleModal");
    modal?.classList.add("show");
    modal?.style.setProperty("display", "block");
  };

  const closeModal = () => {
    const modal = document.getElementById("exampleModal");
    modal?.classList.remove("show");
    modal?.style.setProperty("display", "none");
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const invoice_detail = (o) => {
    navigate(`/invoice/${o.invoice_id}`);
  };

  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">Payment</h4>
        <div className="cardmenu d-flex flex-column flex-md-row">
          <div className="icons d-flex mb-2 mb-md-0">
            <a href="#" className="icon" onClick={openAddModal}>
              <img src={Image.Newfile} alt="New" />
              <span>New</span>
            </a>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ width: "100%", maxWidth: "300px" }}
          />
        </div>
      </div>
 {/* Modal */}
 <div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-body">
          <form>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="invoice">Select Invoice</label>
                
                  <select
                    style={{ width: "100%" }}
                    value={invoice_id ? invoice_id : ''}
                    onChange={(e) => {
                      setinvoice_id(e.target.value ? e.target.value : null); 
                    }}
                  >
                    <option value="" disabled>Select Invoice</option>
                    {InvoiceList.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoice_no}
                      </option>
                    ))}
                  </select>

                </div>
              </div>    
         
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="pay_mode">Pay Mode</label>
                  <select
                    style={{ width: "100%" }}
                    value={pay_mode ? pay_mode : ''}
                      onChange={(e) => {
                        setpay_mode(e.target.value ? e.target.value : null); 
                      }}
                    >
                    <option value="" disabled>Select Pay Mode</option>
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                </div>
              </div>    
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="pay_mode">Payment Status</label>
                  <select
                      style={{ width: "100%" }}
                      value={pay_status ? pay_status : ''} 
                      onChange={(e) => {
                        setpay_status(e.target.value ? e.target.value : null); 
                      }}
                    >
                      <option value="" disabled>Select Payment Status</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partial Paid">Partial Paid</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                </div>
              </div>     
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setamount(e.target.value)}
                    placeholder="Enter Amount"
                    required
                  />
                </div>
              </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="pay_ref">Pay Ref</label>
                  <input
                    type="text"
                    id="pay_ref"
                    value={pay_ref}
                    onChange={(e) => setpay_ref(e.target.value)}
                    placeholder="Enter Pay Ref"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="discard" onClick={updatestate}>
            Discard
          </button>
          <button
            type="button"
            className="modalbutton"
            onClick={() => {
              isEditMode ? update_payment() : Add_payment();
            }}
          >
            {isEditMode ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  </div>

      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th className="text-start">Invoice Id</th>
                <th>Pay Mode</th>
                <th>Amount</th>
                <th>Ref No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {PaymentList.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                  <a
                      href={`/invoice/${item.invoice.id}`}
                      className="icon"
                      style={{ textDecoration: "none" }}
                    >
                    {item.invoice.invoice_no}
                    </a>
                  </td>
                  <td>{item.pay_mode.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
                    }
                  </td>
                  <td>&#8377;{item.amount}</td>
                  <td>{item.ref_no}</td>
                  <td>
                    <FaInfoCircle
                      role="button"
                      tabIndex="0"
                      onClick={() => invoice_detail(item)}
                      color="blue"
                      title="Invoice Detail"
                      style={{ cursor: "pointer" }}
                    />
                    <FaPenSquare
                      role="button"
                      tabIndex="0"
                      onClick={() => openUpdateModal(item)}
                      title="Edit Payment"
                      style={{ cursor: "pointer" }}
                    />
                    <FaTrash
                      role="button"
                      tabIndex="0"
                      onClick={() => delete_Payment(item)}
                      color="red"
                      title="Delete Payment"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(totalItems / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            forcePage={currentPage - 1}
            containerClassName={"pagination justify-content-end"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
}

export default Invoicelistdata;
