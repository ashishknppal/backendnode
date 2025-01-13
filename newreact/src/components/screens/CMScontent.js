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
  const [getCmsContent, set_cmsContent] = useState([]);
  const [title, cms_title] = useState("");
  const [status, set_status] = useState("");
  const [description, set_description] = useState("");
  const [cms, set_cms] = useState("");
  const [getCMS, setCMS] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [old_uploadedFile, setold_UploadedFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedcontentid, setselectedcontentid] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    get_cms_all();
    get_cmsContent(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const get_cms_all = async () => {
    try {
      const res = await axios.get(`${endpoint.CMS_all}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCMS(res.data);
    } catch (error) {
      console.error("Catch error:", error);
    } finally {
    }
  };
  const get_cmsContent = async (page, search = "") => {
    try {
      const res = await axios.get(`${endpoint.CMScONTENT}?page=${page}&search=${search}`);
    
      setTotalItems(res.data.totalItems);
      set_cmsContent(res.data.data);
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

    const formData = new FormData();
          formData.append("title", title);
          formData.append("status", status);
          formData.append("description", description);
          formData.append("content_for", cms);
          if (uploadedFile) {
            formData.append("doc", uploadedFile);
          }
    try {
      const res = await axios.post(`${endpoint.ADD_CMScONTENT}`, formData, {
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
     
      toast.success(res.data.message);
      updatestate();
      get_cmsContent();
    } catch (error) {
      toast.error(error.response.data.error);
      console.error("add content catch error:", error.response.data.error);
    }
  };
  const validateInputs = () => {
    const exist_title = getCmsContent.find(
      (item) => item.id != setselectedcontentid && item.title === title
    );
    console.log("exist ::", exist_title);

   
    return true;
  };
  // update taxcode api
  const update_cmsContent = async () => {
    if (!validateInputs()) return;
 
    const formData = new FormData();
    formData.append("title", title);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("content_for", cms);
    formData.append("old_doc", old_uploadedFile);
    if (uploadedFile) {
      formData.append("doc", uploadedFile);
    }
    try {
      const res = await axios.put(`${endpoint.UPDATE_CMScONTENT}/${selectedcontentid}`, formData, {
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      updatestate();
      setselectedcontentid(null);
      get_cmsContent();
    } catch (error) {
      console.error("update content catch error:", error);
      toast.error(error.response.data.error);
    }
  };

  // delete taxcode api
  const delete_taxcode = async (item) => {
    try {
      const res = await axios.delete(`${endpoint.DELETE_CMScONTENT}/${item.id}`);
      
      toast.success(res.data.message);
      get_cmsContent();
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
    cms_title("");
    set_description("");
    get_cmsContent();
    closeModal();
  };

  // add Category model open
  const openAddModal = () => {
    setIsEditMode(false);
    cms_title("");
    set_description("");
    set_cms("");
    handleShowModal();
  };

  // update Category model open
  const openUpdateModal = (content) => {
    setIsEditMode(true);
    setselectedcontentid(content.id);
    set_status(content.status);
    cms_title(content.title);
    set_cms(content.content_for);
    setold_UploadedFile(content.doc);
    set_description(content.description);
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
      setUploadedFile(file);
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
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="title"> Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => cms_title(e.target.value)}
                  placeholder="Enter Title"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="invoice">Select CMS</label>
                    
                    <select
                      style={{ width: "100%" }}
                      value={cms ? cms : ''}
                      onChange={(e) => {
                        set_cms(e.target.value ? e.target.value : null); 
                      }}
                    >
                      <option value="" disabled>Select CMS</option>
                      {getCMS.map((cms) => (
                        <option key={cms.id} value={cms.id}>
                          {cms.title}
                        </option>
                      ))}
                </select>
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
                    set_status(values[0].id);
                  }}
                  multi={false}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="fileUpload">Upload File</label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".jpg, .jpeg, .png, .pdf, .xls, .xlsx"
                  onChange={(e) => handleFileUpload(e)}
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
</div>
      <div className="table-responsive mt-3">
        <table className="table table-boardered">
          <thead>
            <tr>
              <th>S.No.</th>
              <th> CMS</th>
              <th> Title</th>
              <th> Description</th>
              <th> Status</th>
              <th> Action</th>
            </tr>
          </thead>
          <tbody>
            {getCmsContent.map((o, i) => {
              return (
                <tr key={o.id}>
                  <td>{i + 1}</td>
                  <td>{o.cms_title}</td>
                  <td style={{ maxWidth: '200px', overflow: 'auto', maxHeight: '10px' }}>{o.title}</td>
                  <td
                    dangerouslySetInnerHTML={{ __html: o.description }}
                    style={{
                      maxWidth: '300px',
                      maxHeight: '10px',
                      overflow: 'auto', 
                      border: '1px solid #ddd',
                    }}
                  ></td>
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
