import React, { useState, useEffect } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as Image from "../image";
import { FaTrash, FaPenSquare, FaInfoCircle,FaRupeeSign,FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import Modal from "react-bootstrap/Modal"; 
import Button from "react-bootstrap/Button"; 
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-dropdown-select";
const options = [
  { id: 'credit_card', name: 'Credit Card' },
  { id: 'debit_card', name: 'Debit Card' },
  { id: 'paypal', name: 'Paypal' },
  { id: 'bank_transfer', name: 'Bank Transfer' },
];
function Invoicelist() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [InvoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setamount] = useState([]);
  const [pay_ref, setpay_ref] = useState([]);
  const [pay_mode, setpay_mode] = useState([]);
  const [invoice_id, setinvoice_id] = useState(null);
  const [pay_status, setpay_status] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await delete_Invoice(selectedItem);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  useEffect(() => {
    get_Invoice(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const get_Invoice = async (page, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${endpoint.CONTRACT}?page=${page}&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setInvoiceList(res.data.data.data);
      setTotalItems(res.data.data.total);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const delete_Invoice = async (obj) => {
    try {
      const res = await axios.delete(`${endpoint.DELETE_CONTRACT}/${obj.id}`);
      toast.success(res.data.message);
      get_Invoice(currentPage, searchTerm);
    } catch (error) {
      toast.error("Error deleting invoice.");
      throw error;
    }
  };

  const toDate = (str) => moment(str).format("DD-MM-YYYY");
  const validateInputs = () => {
            
    if (!pay_mode) {
      toast.error("Pay mode is required.");
      return false;
      } 
      if (!pay_status) {
      toast.error("Payment Status is required.");
      return false;
      }
      if (!amount) {
      toast.error("Amount is required.");
      return false;
      }  
      if (!pay_ref) {
      toast.error("Payment Ref is required.");
      return false;
      } 

      return true;
  };
  const Add_payment = async () => {
      if (!validateInputs()) return;
      const data={
        amount: amount,
        pay_ref: pay_ref,
        pay_mode: pay_mode.id,
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
      get_Invoice(currentPage, searchTerm);
      resetModalState();
      } catch (error) {
      console.error("Error adding setting:", error);
      }
  };
  const resetModalState = () => {
    setamount("");
    setpay_ref("");
    closeModal();
  };

  const openAddModal = (valu) => {
  
    setinvoice_id(valu.inv_id);
    resetModalState();
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
  const manage_contract = (item) => {
    navigate(`/manage-contract/${item.id}`);
  }; 
  const sendmail = (item) => {
    navigate(`/email/${item.email}`);
  };
  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">Contract</h4>
        <div className="cardmenu d-flex flex-column flex-md-row">
          <div className="icons d-flex mb-2 mb-md-0">
            <div
              className="icon"
              onClick={() => navigate("/manage-contract")}
              role="button"
              tabIndex="0"
              style={{ cursor: "pointer" }}
            >
              <img src={Image.Newfile} alt="New Invoice" />
              <span>New</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
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
                                  
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="pay_mode">Pay Mode</label>
                        <Select
                          options={options}
                          labelField="name"
                          valueField="id"
                          // selectAll={false}
                          searchable={true}
                          searchBy="name"
                          placeholder="Select Pay Mode"
                          value={pay_mode ? [pay_mode] : []} 
                          onChange={(values) => {
                            console.log("Selected Values:", values);
                            setpay_mode(values[0] || null);
                        }}
                          multi={false}
                      />
                      </div>
                    </div>    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="pay_mode">Payment Status</label>
                        <Select
                          options={[
                            { id: 'Unpaid', name: 'Unpaid' },
                            { id: 'Partial Paid', name: 'Partial Paid' },
                            { id: 'Paid', name: 'Paid' },
                            { id: 'Overdue', name: 'Overdue' },
                        ]}
                          labelField="name"
                          valueField="id"
                          searchable={true}
                          searchBy="name"
                          placeholder="Select Payment Status"
                          value={pay_mode ? [pay_mode] : []}
                          onChange={(values) => {
                          setpay_status(values[0].id || null);
                          }}
                          multi={false}
                      />
                      </div>
                    </div>     
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                          type="number"
                          id="amount"
                          value={amount}
                          onChange={(e) => setamount(e.target.value)}
                          placeholder="Enter Amount"
                          required
                          step="any"
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
                <button type="button" className="discard" onClick={resetModalState}>
                  Discard
                </button>
                <button
                  type="button"
                  className="modalbutton"
                  onClick={() => {
                   Add_payment();
                  }}
                >
                  {"Add"}
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
                <th>S.No.</th>
                <th className="text-start">Customer</th>
                <th>Frequency</th>
                <th>Next Invoice Date</th>
                <th>Last Generated Date</th>
                <th>SubTotal</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {InvoiceList?.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="text-start">
                    <a
                      href={`/profile/${item.client_id}`}
                      className="icon"
                      style={{ textDecoration: "none" }}
                    >
                      {item.name}
                      <br />
                      {item.email}
                    </a>
                  </td>
                  <td>{item.renewal_frequency}</td>
                  <td>{toDate(item.next_invoice_date)}</td>
                  <td>{toDate(item.last_generated_date)}</td>
                  <td>&#8377; {item.sub_total}</td>
                  <td>&#8377; {item.net_amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.payment_status === "Active"
                          ? "bg-primary"
                          : "bg-success"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <FaInfoCircle
                      role="button"
                      tabIndex="0"
                      onClick={() => navigate(`/invoice/${item.inv_id}`)}
                      color="blue"
                      title="Invoice Detail"
                      style={{ cursor: "pointer" }}
                    />
                    <FaRupeeSign
                      role="button"
                      onClick={()=>openAddModal(item)}
                      tabIndex="0"
                      title="Payments"
                      style={{ cursor: "pointer" }}
                    /> 
                    <FaPenSquare
                      role="button"
                      tabIndex="0"
                      onClick={() => manage_contract(item)}
                      title="Edit Invoice"
                      style={{ cursor: "pointer" }}
                    />
                    <FaEnvelope
                      role="button"
                      tabIndex="0"
                      onClick={() => sendmail(item)}
                      color="green"
                      title="Send Mail"
                      style={{ cursor: "pointer" }}
                    /> 
                    <FaTrash
                      role="button"
                      tabIndex="0"
                      onClick={() => handleDeleteClick(item)}
                      color="red"
                      title="Delete Invoice"
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

      {/* Modal */}
      <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Contract? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Invoicelist;
