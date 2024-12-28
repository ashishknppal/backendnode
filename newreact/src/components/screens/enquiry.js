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

  
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    get_enquiery(currentPage, searchTerm);
  }, [currentPage, searchTerm]);


  const get_enquiery = async (page, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${endpoint.ENQUIRY}?page=${page}&search=${search}`, {
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


 

  const DELETE_ENQUIRY = async (Client) => {
    try {
      const res = await axios.delete(`${endpoint.DELETE_ENQUIRY}/${Client.id}`);
      toast.success(res.data.message);
      get_enquiery();
    } catch (error) {
      console.error("delete Client catch error:", error);
    }
  };
  const addMinToTimestamp = (timestamp, addedMinutes) => {
    return moment(timestamp)
      .add(addedMinutes, "minutes")
      .format("DD-MM-YYYY hh:mm:ss A");
  };

  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">Enquiry</h4>
        <div className="cardmenu d-flex flex-column flex-md-row">
          <div className="icons d-flex mb-2 mb-md-0">
          
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
                  <th>Description</th>
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
                      
                          {o.name}
                          <br />
                          {o.email}
                          
                        </td>
                        <td>{o.phone}</td>
                        <td>{o.postcode}</td>
                        <td>{o.loan_type}</td>
                        <td>{o.description}</td>
                 
                        <td>{addMinToTimestamp(o.created_at)}</td>
                        <td className="text-center">
                          <svg
                           style={{ cursor: "pointer" }}
                            onClick={() => {
                                DELETE_ENQUIRY(o);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="red"
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                          </svg>
                          
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
