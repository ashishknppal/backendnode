import React, { useState, useEffect } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import * as Image from "../image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import Select from "react-dropdown-select";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Taxcode() {
  const [searchTerm, setSearchTerm] = useState("");
  const [getbankP, set_bankp] = useState([]);

  const [year, setYear] = useState("");
  const [ShareCapital, setShareCapital] = useState("");
  const [RoFunds, setRoFunds] = useState("");
  const [WorkingFunds, setWorkingFunds] = useState("");
  const [Investments, setInvestments] = useState("");
  const [NetPro, setNetPro] = useState("");
  const [TotalDeposits, setTotalDeposits] = useState("");
  const [CurrentDeposits, setCurrentDeposits] = useState("");
  const [SavingDeposits, setSavingDeposits] = useState("");
  const [TermDeposits, setTermDeposits] = useState("");
  const [LoanAdvances, setLoanAdvances] = useState("");
  const [status, setStatus] = useState("");


  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedcontentid, setselectedcontentid] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    
    get_bankProccess(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const get_bankProccess = async (page, search = "") => {
    try {
      const res = await axios.get(`${endpoint.BankP}?page=${page}&search=${search}`);
    
      setTotalItems(res.data.totalItems);
      set_bankp(res.data.data);
    } catch (error) {
      console.error("users catch error:", error);
    }
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  // add taxcode api
  const add_bp  = async () => {
    if (!validateInputs()) return;
    const payload = {
        year: year,
        status: status,
        share_capital: ShareCapital,
        ro_funds: RoFunds,
        working_funds:WorkingFunds,
        investments:Investments,
        net_pro:NetPro,
        total_deposits:TotalDeposits,
        current_deposits:CurrentDeposits,
        saving_deposits:SavingDeposits,
        term_deposits:TermDeposits,
        loan_advances:LoanAdvances,
    };
    try {
      const res = await axios.post(`${endpoint.ADD_BankP}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      toast.success(res.data.message);
      updatestate();
      get_bankProccess();
    } catch (error) {
      console.error("add content catch error:", error);
    }
  };
  const validateInputs = () => {
    const exist_year = getbankP.find(
      (item) => item.id != setselectedcontentid && item.year === year
    );
    console.log("exist ::", exist_year);

   
    return true;
  };
  // update taxcode api
  const update_cmsContent = async () => {
    if (!validateInputs()) return;
    const payload = {
      year: year,
      status: status,
      share_capital: ShareCapital,
      ro_funds: RoFunds,
      working_funds:WorkingFunds,
      investments:Investments,
      net_pro:NetPro,
      total_deposits:TotalDeposits,
      current_deposits:CurrentDeposits,
      saving_deposits:SavingDeposits,
      term_deposits:TermDeposits,
      loan_advances:LoanAdvances,
    };
    try {
      const res = await axios.put(`${endpoint.UPDATE_BankP}/${selectedcontentid}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("update response::::", res);

      toast.success(res.data.message);
      updatestate();
      setselectedcontentid(null);
      get_bankProccess();
    } catch (error) {
      console.error("update content catch error:", error);
    }
  };

  // delete taxcode api
  const delete_taxcode = async (item) => {
    try {
      const res = await axios.delete(`${endpoint.DELETE_BankP}/${item.id}`);
      
      toast.success(res.data.message);
      get_bankProccess();
    } catch (error) {
      console.error("delete content catch error:", error);
    }
  };

  const handleShowModal = () => {
    const modal = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
    modal.show();
  };

  const closeModal = () => {
    const modalElement = document.getElementById("exampleModal");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  const updatestate = () => {
    setYear("");
    setShareCapital("");
    setRoFunds("");
    setWorkingFunds("");
    setInvestments("");
    setNetPro("");
    setTotalDeposits("");
    setCurrentDeposits("");
    setSavingDeposits("");
    setTermDeposits("");
    setLoanAdvances("");
    setStatus("");
    get_bankProccess();
    closeModal();
  };

  // add Category model open
  const openAddModal = () => {
    setIsEditMode(false);
    setYear("");
    setShareCapital("");
    setRoFunds("");
    setWorkingFunds("");
    setInvestments("");
    setNetPro("");
    setTotalDeposits("");
    setCurrentDeposits("");
    setSavingDeposits("");
    setTermDeposits("");
    setLoanAdvances("");
    setStatus("");
    handleShowModal();
  };

  // update Category model open
  const openUpdateModal = (content) => {
    setIsEditMode(true);
    setselectedcontentid(content.id);
    setYear(content.year);
    setShareCapital(content.share_capital);
    setRoFunds(content.ro_funds);
    setWorkingFunds(content.working_funds);
    setInvestments(content.investments);
    setNetPro(content.net_pro);
    setTotalDeposits(content.total_deposits);
    setCurrentDeposits(content.current_deposits);
    setSavingDeposits(content.saving_deposits);
    setTermDeposits(content.term_deposits);
    setLoanAdvances(content.loan_advances);
    setStatus(content.status);
    handleShowModal();
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; 
  
    if (file) {
     
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please select an image, PDF, or Excel file.");
        return;
      }

      console.log("File selected:", file);
    }
  };
  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">CMS Content</h4>
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
            onChange={handleSearchChange}
            className="form-control"
            style={{ width: "100%", maxWidth: "300px" }}
          />
        </div>
      </div>
      {/* modal */}
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
            {/* Year */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                    type="text"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Enter Year"
                    required
                />
                </div>
            </div>

            {/* Share Capital */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="shareCapital">Share Capital</label>
                <input
                    type="number"
                    id="shareCapital"
                    value={ShareCapital}
                    onChange={(e) => setShareCapital(e.target.value)}
                    placeholder="Enter Share Capital"
                    required
                />
                </div>
            </div>

            {/* Reserve & Other Funds */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="roFunds">Reserve & Other Funds</label>
                <input
                    type="number"
                    id="roFunds"
                    value={RoFunds}
                    onChange={(e) => setRoFunds(e.target.value)}
                    placeholder="Enter Reserve & Other Funds"
                    required
                />
                </div>
            </div>

            {/* Working Funds */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="workingFunds">Working Funds</label>
                <input
                    type="number"
                    id="workingFunds"
                    value={WorkingFunds}
                    onChange={(e) => setWorkingFunds(e.target.value)}
                    placeholder="Enter Working Funds"
                    required
                />
                </div>
            </div>

            {/* Investments */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="investments">Investments</label>
                <input
                    type="number"
                    id="investments"
                    value={Investments}
                    onChange={(e) => setInvestments(e.target.value)}
                    placeholder="Enter Investments"
                    required
                />
                </div>
            </div>

            {/* Net Profit */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="netPro">Net Profit</label>
                <input
                    type="number"
                    id="netPro"
                    value={NetPro}
                    onChange={(e) => setNetPro(e.target.value)}
                    placeholder="Enter Net Profit"
                    required
                />
                </div>
            </div>

            {/* Total Deposits */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="totalDeposits">Total Deposits</label>
                <input
                    type="number"
                    id="totalDeposits"
                    value={TotalDeposits}
                    onChange={(e) => setTotalDeposits(e.target.value)}
                    placeholder="Enter Total Deposits"
                    required
                />
                </div>
            </div>

            {/* Current Deposits */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="currentDeposits">Current Deposits</label>
                <input
                    type="number"
                    id="currentDeposits"
                    value={CurrentDeposits}
                    onChange={(e) => setCurrentDeposits(e.target.value)}
                    placeholder="Enter Current Deposits"
                    required
                />
                </div>
            </div>

            {/* Saving Deposits */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="savingDeposits">Saving Deposits</label>
                <input
                    type="number"
                    id="savingDeposits"
                    value={SavingDeposits}
                    onChange={(e) => setSavingDeposits(e.target.value)}
                    placeholder="Enter Saving Deposits"
                    required
                />
                </div>
            </div>

            {/* Term Deposits */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="termDeposits">Term Deposits</label>
                <input
                    type="number"
                    id="termDeposits"
                    value={TermDeposits}
                    onChange={(e) => setTermDeposits(e.target.value)}
                    placeholder="Enter Term Deposits"
                    required
                />
                </div>
            </div>

            {/* Loan Advances */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="loanAdvances">Loan Advances</label>
                <input
                    type="number"
                    id="loanAdvances"
                    value={LoanAdvances}
                    onChange={(e) => setLoanAdvances(e.target.value)}
                    placeholder="Enter Loan Advances"
                    required
                />
                </div>
            </div>

            {/* Status */}
            <div className="col-md-6">
                <div className="form-group">
                <label htmlFor="status">Status</label>
                <Select
                    options={[
                    { id: 1, name: 'Active' },
                    { id: 0, name: 'Inactive' },
                    ]}
                    labelField="name"
                    valueField="id"
                    searchable={true}
                    searchBy="name"
                    placeholder="Select Status"
                    value={status ? [status] : []}
                    onChange={(values) => {
                    setStatus(values[0]?.id || null);
                    }}
                    multi={false}
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
            isEditMode ? update_cmsContent() : add_bp();
          }}
        >
          {isEditMode ? "Update" : "Add"}
        </button>
      </div>
    </div>
  </div>
</div>;
      <div className="table-responsive mt-3">
        <table className="table table-boardered">
          <thead>
            <tr>
              <th>S.No.</th>
              <th> Financial Year</th>
              <th> Share Capital</th>
              <th> Reverse & Other Funds</th>
              <th> Working Funds</th>
              <th> Investments</th>
              <th> Net Profit</th>
              <th> Total Deposit</th>
              <th> Current Deposit</th>
              <th> Saving Deposit</th>
              <th> Term Deposit</th>
              <th> Loan & Advances</th>
              <th> Status</th>
              <th> Action</th>
            </tr>
          </thead>
          <tbody>
            {getbankP.map((o, i) => {
              return (
                <tr key={o.id}>
                  <td>{i + 1}</td>
                  <td>{o.year}</td>
                  <td>{o.share_capital}</td>
                  <td>{o.ro_funds}</td>
                  <td>{o.working_funds}</td>
                  <td>{o.investments}</td>
                  <td>{o.net_pro}</td>
                  <td>{o.total_deposits}</td>
                  <td>{o.current_deposits}</td>
                  <td>{o.saving_deposits}</td>
                  <td>{o.term_deposits}</td>
                  <td>{o.loan_advances}</td>
                  <td>
                    <span
                      className={`badge ${
                        o.status === 0 ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {o.status === 0 ? "Inactive" : "Active"}
                    </span>
                  </td>


                  <td className="text-center">
                    <svg
                      onClick={() => {
                        delete_taxcode(o);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="red"
                      className="bi bi-trash3-fill"
                      viewBox="0 0 16 16"
                      style={{ cursor: "pointer" }}
                    >
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                    <svg
                      onClick={() => {
                        openUpdateModal(o);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#5a28ab"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                      style={{ cursor: "pointer" }}
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
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
    </div>
  );
}

export default Taxcode;
