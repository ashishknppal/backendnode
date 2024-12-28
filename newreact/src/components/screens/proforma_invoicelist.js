import React, { useState, useEffect } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as Image from "../image";
import { FaTrash, FaPenSquare, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "react-bootstrap"; // React Bootstrap

function Invoicelist() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [InvoiceList, setInvoiceList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Track selected invoice for deletion
  const itemsPerPage = 10;

  useEffect(() => {
    get_Invoice(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const get_Invoice = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${endpoint.PROFORMA_INVOICE}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      setInvoiceList(res.data.data);
      setTotalItems(res.data.total);
    } catch (error) {
      console.error("Catch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const delete_Invoice = async () => {
    if (!selectedInvoice) return;
    try {
      const res = await axios.delete(`${endpoint.PROFORMA_DELETE_INVOICE}/${selectedInvoice.id}`);
      console.log("delete response::::", res);
      toast.success(res.data.message);
      get_Invoice();
    } catch (error) {
      console.error("delete invoice catch error:", error);
    } finally {
      setShowModal(false);
      setSelectedInvoice(null);
    }
  };

  const handleDeleteClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toDate = (str) => {
    return moment(str).format("DD-MM-YYYY");
  };
  const pro_manage = (item) => {
    navigate(`/manage-proforma-invoice/${item.id}`);
  }; 
  const sendmail = (item) => {
    navigate(`/email/${item.billing_email}`);
  };
  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">Proforma Invoice</h4>
        <div className="cardmenu d-flex flex-column flex-md-row">
          <div className="icons d-flex mb-2 mb-md-0">
            <div
              className="icon"
              onClick={() => navigate("/manage-proforma-invoice")}
              role="button"
              tabIndex="0"
              style={{ cursor: "pointer" }}
            >
              <img src={Image.Newfile} alt="New Proform Invoice" />
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

      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-boardered">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Invoice No.</th>
                <th>Invoice Date</th>
                <th className="text-start">Customer</th>
                <th>Paid Amount</th>
                <th>Total Amount</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {InvoiceList?.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <a href={`/proforma-invoice/${item.id}`} className="icon" style={{ textDecoration: "none" }}>
                      {item.proforma_invoice_number}
                    </a>
                  </td>
                  <td>{toDate(item.proforma_invoice_date)}</td>
                  <td className="text-start">
                    <a href={`/profile/${item.client_id}`} className="icon" style={{ textDecoration: "none" }}>
                      {item.billing_name}
                      <br />
                      {item.billing_email}
                    </a>
                  </td>
                  <td>&#8377; {item.total_invoice_value}</td>
                  <td>&#8377; {item.grand_total}</td>
                  <td>{toDate(item.issue_date)}</td>
                  <td>
                    <span
                      className={`badge ${item.status === "Draft" ? "bg-danger" : "bg-success"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <FaInfoCircle
                      role="button"
                      tabIndex="0"
                      color="blue"
                      title="Invoice Detail"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/proforma-invoice/${item.id}`)}
                    />
                    <FaPenSquare
                      role="button"
                      tabIndex="0"
                      onClick={() => pro_manage(item)}
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
                      color="red"
                      title="Delete Invoice"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteClick(item)}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this invoice? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={delete_Invoice}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Invoicelist;
