import React, { useState, useEffect } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import * as Image from "../image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { Country, State } from "country-state-city";
import Select from "react-select";

function Client() {
  const [searchTerm, setSearchTerm] = useState("");
  const [getClient, setClient] = useState([]);
  
  const [salutation, setsalutation] = useState("");
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState(null);
  const [account_type, setaccount_type] = useState(null);
  const [branch, setbranch] = useState("");
  const [postcode, setpostcode] = useState("");
  const [prefered_language, setprefered_language] = useState("");
  const [agree, setagree] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    get_Client(currentPage, searchTerm);
    loadCountries();
  }, [currentPage, searchTerm]);

  const loadCountries = () => {
    const countries = Country.getAllCountries();
    const formattedCountries = countries.map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
    setagree(formattedCountries);
  };
  const handleCountryChange = (selectedCountry) => {
    setaccount_type(selectedCountry);
    setphone(null); // Reset the state selection

    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.value);
      const formattedStates = states.map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
      setStateOptions(formattedStates);
    } else {
      setStateOptions([]);
    }
  };
  const handleStateChange = (selectedState) => {
    setphone(selectedState);
  };
  const get_Client = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${endpoint.CLIENT}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTotalItems(res.data.totalItems);
      setClient(res.data.data);
    } catch (error) {
      console.error("Catch error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  const validateInputs = () => {
    const mobileRegex = /^\d{10}$/;

    if (!salutation) {
      toast.error("Client name is required");
      return false;
    }
    if (!fname) {
      toast.error("Client email is required");
      return false;
    }
    if (!lname) {
      toast.error("Client address is required");
      return false;
    }
    if (!postcode) {
      toast.error("Client mobile number is required");
      return false;
    } else if (!mobileRegex.test(postcode)) {
      toast.error("Client mobile number must be exactly 10 digits");
      return false;
    }
    if (!prefered_language) {
      toast.error("prefered_language is required");
      return false;
    } else if (prefered_language.length > 15) {
      toast.error("prefered_language cannot be greater than 15 characters");
      return false;
    }
    if (!account_type) {
      toast.error("Client country is required");
      return false;
    }
    if (!email) {
      toast.error("Client city is required");
      return false;
    }
    if (!phone) {
      toast.error("Client state is required");
      return false;
    }
    if (!branch) {
      toast.error("Client pincode is required");
      return false;
    }
    return true;
  };
  const addClient = async () => {
    if (!validateInputs()) return;

    const payload = {
      salutation: salutation,
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      account_type: account_type,
      branch: branch,
      postcode: postcode,
      prefered_language: prefered_language,
      agree: agree,      

    };
    try {
      const res = await axios.post(`${endpoint.ADD_CLIENT}`, payload, {
        headers: {
           "Content-Type": "application/json",
        },
      });
      console.log("add Client response::::", res);
      toast.success(res.data.message);
      updatestate();
      get_Client();
    } catch (error) {
      console.error("add Client catch error:", error);
    }
  };
  const updateClient = async () => {
    if (!validateInputs()) return;
    const payload = {
      salutation: salutation,
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      account_type: account_type,
      branch: branch,
      postcode: postcode,
      prefered_language: prefered_language,
      agree: agree,      

    };
    try {
      const res = await axios.post(
        `${endpoint.UPDATE_CLIENT}/${selectedClientId}`,
        payload,
        {
          headers: {
             "Content-Type": "application/json",
          },
        }
      );
 
      toast.success(res.data.message);
      updatestate();
      setSelectedClientId(null);
      get_Client();
    } catch (error) {
      console.error("update category catch error:", error);
    }
  };
  const delete_Client = async (Client) => {
    try {
      const res = await axios.delete(`${endpoint.DELETE_CLIENT}/${Client.id}`);
      toast.success(res.data.message);
      get_Client();
    } catch (error) {
      console.error("delete Client catch error:", error);
    }
  };
  const updatestate = () => {
    setsalutation("");
    setfname("");
    setlname("");
    setpostcode("");
    setprefered_language("");
    setbranch("");
    setemail("");
    setaccount_type(null);
    setphone(null);
    closeModal();
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
  const openAddModal = () => {
    setIsEditMode(false);
    updatestate();
    handleShowModal();
  };
  const openUpdateModal = (Client) => {
    setIsEditMode(true);
    setsalutation(Client.name);
    setSelectedClientId(Client.id);
    setlname(Client.address);
    setpostcode(Client.mobile);
    setprefered_language(Client.prefered_language);
    setemail(Client.city);
    setphone(Client.state);
    if (Client.country) {
      const country = agree.find((c) => c.value === Client.country);
      setaccount_type(country || null);

      // Load States based on Country
      const states = State.getStatesOfCountry(Client.country);
      const formattedStates = states.map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
      setStateOptions(formattedStates);

      // Set State
      if (Client.state) {
        const state = formattedStates.find((s) => s.value === Client.state);
        setphone(state || null);
      }
    } else {
      setaccount_type(null);
      setStateOptions([]);
      setphone(null);
    }
    setbranch(Client.pincode);
    setfname(Client.email);
    handleShowModal();
  };

  const time = (time) => {
    return moment(time, "hh:mm:ss").format("hh:mm:ss A");
  };
  const toDate = (str) => {
    return moment(str).format("DD-MM-YYYY");
  };
  const addMinToTimestamp = (timestamp, addedMinutes) => {
    return moment(timestamp)
      .add(addedMinutes, "minutes")
      .format("DD-MM-YYYY hh:mm:ss A");
  };
  const date_time = (timestamp) => {
    return moment(timestamp).format("DD-MM-YYYY hh:mm:ss A");
  };

  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">Clients</h4>
        <div className="cardmenu d-flex flex-column flex-md-row">
          <div className="icons d-flex mb-2 mb-md-0">
            {/* <a href="#" className="icon" onClick={openAddModal}>
              <img src={Image.Newfile} alt="New" />
              <span>New</span>
            </a> */}
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
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{isEditMode ? "Update Client" : "Add Client"}</h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="salutation">Name</label>
                      <input
                        type="text"
                        id="salutation"
                        value={salutation}
                        onChange={(e) => setsalutation(e.target.value)}
                        placeholder="Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fname">Email</label>
                      <input
                        type="email"
                        id="fname"
                        value={fname}
                        onChange={(e) => setfname(e.target.value)}
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lname">Address</label>
                      <input
                        type="text"
                        id="lname"
                        value={lname}
                        onChange={(e) => setlname(e.target.value)}
                        placeholder="Address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="account_type">Country</label>
                      <Select
                        id="account_type"
                        value={account_type}
                        onChange={handleCountryChange}
                        options={agree}
                        placeholder="Select Country"
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="phone">State</label>
                      <Select
                        id="phone"
                        value={phone}
                        onChange={handleStateChange}
                        options={stateOptions}
                        placeholder="Select State"
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">City</label>
                      <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="branch">Pincode</label>
                      <input
                        type="number"
                        id="branch"
                        value={branch}
                        onChange={(e) => setbranch(e.target.value)}
                        placeholder="Pincode"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="postcode">Mobile</label>
                      <input
                        type="number"
                        id="postcode"
                        value={postcode}
                        onChange={(e) => setpostcode(e.target.value)}
                        placeholder="Mobile No."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="prefered_language">GST IN / Taxcode</label>
                      <input
                        type="text"
                        id="prefered_language"
                        value={prefered_language}
                        onChange={(e) => setprefered_language(e.target.value)}
                        placeholder="GST IN"
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
                  isEditMode ? updateClient() : addClient();
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
        <div>
          <div className="table-responsive mt-3">
            <table className="table table-boardered">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th className="text-start">Name</th>
                  <th>Contact No.</th>
                  <th>PostCode</th>
                  <th>Loan Type</th>
                  <th>Prefered Language</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {getClient.length > 0 ? (
                  getClient.map((o, i) => {
                    return (
                      <tr key={o.id}>
                        <td>{i + 1}</td>
                        <td className="text-start">
                        <a
                            href={`/profile/${o.id}`}
                            className="icon"
                            style={{ textDecoration: "none" }}
                          >
                          {o.salutation} {o.fname} {o.lname}
                          <br />
                          {o.email}
                          </a>
                        </td>
                        <td>{o.phone}</td>
                        <td>{o.postcode}</td>
                        <td>{o.account_type}</td>
                        <td>{o.prefered_language}</td>
                 
                        <td>{addMinToTimestamp(o.created_at)}</td>
                        <td className="text-center">
                          <svg
                           style={{ cursor: "pointer" }}
                            onClick={() => {
                              delete_Client(o);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="red"
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                          </svg>
                          {/* <svg
                           style={{ cursor: "pointer" }}
                            onClick={() => {
                              openUpdateModal(o);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#5a28ab"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg> */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11">No Data Available!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
export default Client;
