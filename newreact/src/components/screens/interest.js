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
import { Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

function Taxcode() {
  const [searchTerm, setSearchTerm] = useState("");
  const [getCareer, set_career] = useState([]);
  const [title, interest_title] = useState("");
  const [status, set_status] = useState("");
  const [description, set_description] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedcontentid, setselectedcontentid] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    get_interestfun(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const [modalContent, setModalContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModaldata = () => {
    setModalContent("");
    setShowModal(false);
  };
  const get_interestfun = async (page, search = "") => {
    try {
      const res = await axios.get(`${endpoint.INTEREST}?page=${page}&search=${search}`);
    
      setTotalItems(res.data.totalItems);
      set_career(res.data.data);
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
  const add_cmsContent  = async () => {
    if (!validateInputs()) return;
    const payload = {
      title: title,
      status: status,
      description: description,
    
    };
    try {
      const res = await axios.post(`${endpoint.ADD_INTEREST}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      toast.success(res.data.message);
      updatestate();
      get_interestfun();
    } catch (error) {
      console.error("add content catch error:", error);
    }
  };
  const validateInputs = () => {
    const exist_title = getCareer.find(
      (item) => item.id != setselectedcontentid && item.title === title
    );
    console.log("exist ::", exist_title);

   
    return true;
  };
  // update taxcode api
  const update_cmsContent = async () => {
    if (!validateInputs()) return;
    const payload = {
      title: title,
      status: status,
      description: description,
    
    };
    try {
      const res = await axios.put(`${endpoint.UPDATE_INTEREST}/${selectedcontentid}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("update response::::", res);

      toast.success(res.data.message);
      updatestate();
      setselectedcontentid(null);
      get_interestfun();
    } catch (error) {
      console.error("update content catch error:", error);
    }
  };

  // delete taxcode api
  const delete_career = async (item) => {
    try {
      const res = await axios.delete(`${endpoint.DELETE_INTEREST}/${item.id}`);
      
      toast.success(res.data.message);
      get_interestfun();
    } catch (error) {
      console.error("delete interest catch error:", error);
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
    interest_title("");
    set_description("");
    get_interestfun();
    closeModal();
  };

  // add Category model open
  const openAddModal = () => {
    setIsEditMode(false);
    interest_title("");
    set_description("");
    handleShowModal();
  };

  // update Category model open
  const openUpdateModal = (content) => {
    setIsEditMode(true);
    setselectedcontentid(content.id);
    interest_title(content.title);
    set_description(content.content);
    handleShowModal();
  };

  return (
    <div className="container-fluid product p-3 bg-white">
      <div className="card header">
        <h4 className="mb-3 mb-md-0">Interest Management</h4>
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
    <Modal.Header>
      <Modal.Title>{isEditMode ? "Edit Interest" : "Add Interest"}</Modal.Title>
    </Modal.Header>
      <div className="modal-body">
        <form>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="title"> Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => interest_title(e.target.value)}
                  placeholder="Enter Title"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="CMSImage">Status</label>
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
                    set_status(values[0]?.id || 0);
                  }}
                  multi={false}
                />
              </div>
            </div>

          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    set_description(data);
                  }}
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
            isEditMode ? update_cmsContent() : add_cmsContent();
          }}
        >
          {isEditMode ? "Update" : "Add"}
        </button>
      </div>
    </div>
  </div>
</div>;
<div className="table-responsive mt-3">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getCareer.map((o, i) => (
            <tr key={o.id}>
              <td>{i + 1}</td>
              <td style={{ maxWidth: "200px", overflow: "auto", maxHeight: "10px" }}>{o.title}</td>
              <td className="text-center" style={{ cursor: "pointer" }}              >
                <span
                  className="badge bg-primary"
                  onClick={() => openModal(o.content)}
                  title="View Description"
                >
                  <FaEye/>
                </span>
              </td>
              <td>
                <span
                  className={`badge ${o.status === 0 ? "bg-danger" : "bg-success"}`}
                >
                  {o.status === 0 ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="text-center">
                <svg
                  onClick={() => {
                    delete_career(o);
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

      {/* Modal */}
      <Modal show={showModal} onHide={closeModaldata}  size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: modalContent }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModaldata}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
}

export default Taxcode;
