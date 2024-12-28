import React, { useState, useEffect } from "react";
import axios from "../../axios";
import endpoint, { ImageUrl } from "../../endpoints";
import * as Image from "../image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";

function Setting() {
  const [getSetting, setSetting] = useState([]);
  const [setting_prefix, setsettingprefix] = useState("");
  const [setting_invoice, setsettinginvoice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedSettingId, setSelectedSettingId] = useState(null);

  useEffect(() => {
    get_SETTING();
  }, []);

  const get_SETTING = async () => {
    try {
      const res = await axios.get(`${endpoint.SETTING}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSetting(res.data);
      openUpdateModal(res.data[0]);
    } catch (error) {
      console.error("users catch error:", error);
    }
  };

  const validateInputs = () => {
    const exist_setting = getSetting.find(
      (item) => item.id != selectedSettingId && item.inv_prefix === setting_prefix
    );
    if (!setting_prefix) {
      toast.error("setting invoice prefix is required.");
      return false;
    }
    if (!setting_invoice && !isEditMode) {
      toast.error("setting invoice no is required.");
      return false;
    }
    if (exist_setting) {
      toast.error("setting invoice prefix is already exist");
      return false;
    }
    return true;
  };

  const add_Setting = async () => {
    if (!validateInputs()) return;
    const formData = new FormData();
    formData.append("invoice_prefix", setting_prefix);
    formData.append("invoice_no", setting_invoice);

    try {
      const res = await axios.post(`${endpoint.ADD_SETTING}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      get_SETTING();
    } catch (error) {
      console.error("add Setting catch error:", error);
    }
  };

  const updateSetting = async () => {
    if (!validateInputs()) return;
    const formData = new FormData();
    formData.append("invoice_prefix", setting_prefix);
    formData.append("invoice_no", setting_invoice);
    console.log("form data", formData);
    try {
      const res = await axios.post(
        `${endpoint.UPDATE_SETTING}/${selectedSettingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("update response::::", res);

      toast.success(res.data.message);
      setSelectedSettingId(null);
      get_SETTING();
    } catch (error) {
      console.error("update setting catch error:", error);
    }
  };
  const delete_setting = async (product) => {
    try {
      const res = await axios.delete(
        `${endpoint.DELETE_SETTING}/${product.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      get_SETTING();
    } catch (error) {
      console.error("delete Setting catch error:", error);
    }
  };
 

  const openUpdateModal = (product) => {
    setIsEditMode(true);
    setsettingprefix(product.inv_prefix);
    setsettinginvoice(product.inv_no);
    setSelectedSettingId(product.id);
  };


  return  <div className="container-fluid product p-3 bg-white">
  <div className="card header">
    <h4 className="mb-3 mb-md-0">Setting</h4>
  </div>

  {/* Modal */}
<div className="container-fluid">

          <form>
            <div className="row m-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="invoicePrefix">Invoice Prefix</label>
                  <input
                    type="text"
                    id="invoicePrefix"
                    value={setting_prefix}
                    onChange={(e) => setsettingprefix(e.target.value)}
                    placeholder="Enter Invoice Prefix"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="categoryImage">Invoice No</label>
                  <input
                    type="text"
                    id="invoiceno"
                    value={setting_invoice}
                    onChange={(e) => setsettinginvoice(e.target.value)}
                    placeholder="Enter Invoice No"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
      <center>
          <button type="button" className="modalbutton" onClick={() => {isEditMode ? updateSetting() : add_Setting();}}>
            {isEditMode ? "Update" : "Add"}
          </button>
      </center>
     
  </div>
 
</div>;
}

export default Setting;
