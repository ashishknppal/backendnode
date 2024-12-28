import React, { useState, useRef, useEffect } from "react";
import axios from "../../axios";
import endpoint, { ImageUrl } from "../../endpoints";
import * as Image from "../image";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
    FaInfoCircle,
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaCog,
} from "react-icons/fa";

const UserProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("invoice");
    const [imageUrl, setImageUrl] = useState("");
    const [user, SetUser] = useState([]);
    const [invoiceList, SetinvoiceList] = useState([]);
    const [contractList, SetContractList] = useState([]);
    const [paymentList, SetPaymentList] = useState([]);
    const [proformaList, SetproformaList] = useState([]);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    get_User();
    }, []);

    const get_User = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${endpoint.USER_DETAILS}?id=${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const invoicedata = res.data.data.find((item) => item.id == id);
          
          setLoading(false);
          SetUser(invoicedata);
          SetinvoiceList(invoicedata.invoice);
          SetContractList(invoicedata.contract);
          SetPaymentList(invoicedata.payment);
          SetproformaList(invoicedata.proforma);
        } catch (error) {
          setLoading(false);
          console.error("Catch error:", error);
        }
      };
      const toDate = (str) => moment(str).format("DD-MM-YYYY");
      const invoiceDetail = (o) => {
        navigate(`/invoice/${o}`);
      }; 
      const invoice_detail = (o) => {
        navigate(`/proforma-invoice/${o}`);
      };  
      
      const sendmail = (o) => {
        navigate(`/email/${o.email}`);
      };
      
  const renderTabContent = () => {
    switch (activeTab) {
      case "invoice":
        return loading ?(
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) :(
          <div className="tab-content">
         <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Invoice No.</th>
                <th>Invoice Date</th>
                <th>Paid Amount</th>
                <th>Total Amount</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <a
                      href={`/invoice/${item.id}`}
                      className="icon"
                      style={{ textDecoration: "none" }}
                    >
                      {item.invoice_no}
                    </a>
                  </td>
                  <td>{toDate(item.invoice_date)}</td>
                  <td>&#8377; {item.paid_amount}</td>
                  <td>&#8377; {item.grand_total}</td>
                  <td>{toDate(item.issue_date)}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.payment_status === "Unpaid"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {item.payment_status}
                    </span>
                  </td>
                  <td>
                    <FaInfoCircle
                      role="button"
                      tabIndex="0"
                      onClick={() => invoiceDetail(item.id)}
                      color="blue"
                      title="Invoice Detail"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>
        );
      case "contract":
        return (
          <div className="tab-content">
        <div className="table-responsive mt-3">
          <table className="table table-boardered">
            <thead>
              <tr>
                <th>S.No.</th>
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
              {contractList?.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
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
                      </span></td>
                    <td>
                      <FaInfoCircle
                        role="button"
                        tabIndex="0"
                        onClick={() => {
                            invoiceDetail(item.inv_id);
                        }}
                        color="blue"
                        title="Invoice Detail"
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          </div>
        );
      case "payment":
        return (
          <div className="tab-content">
           <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No.</th>
                <th className="text-start">Invoice Id</th>
                <th>Pay Mode</th>
                <th>Amount</th>
                <th>Ref No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                    <td>
                        <a
                            href={`/invoice/${item.invoice_id}`}
                            className="icon"
                            style={{ textDecoration: "none" }}
                            >
                            {item.invoice_no}
                        </a>
                    </td>
                  <td>{item.pay_mode}</td>
                  <td>{item.amount}</td>
                  <td>{item.ref_no}</td>
                  <td>
                    <FaInfoCircle
                      role="button"
                      tabIndex="0"
                      onClick={() => invoiceDetail(item.invoice_id)}
                      color="blue"
                      title="Invoice Detail"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        )
        case "proforma":
          return (
              <div className="tab-content">
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
                    {proformaList?.map((item, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                          <a href={`/proforma-invoice/${item.id}`}
                            className="icon"
                            style={{ textDecoration: "none" }}>
                            {item.proforma_invoice_number}</a></td>
                          <td>{toDate(item.proforma_invoice_date)}</td>
                          <td className="text-start">
                          <a
                            href={`/profile/${item.client_id}`}
                            className="icon"
                            style={{ textDecoration: "none" }}
                          >
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
                              className={`badge ${
                                item.status === "Draft"
                                  ? "bg-danger"
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
                              onClick={() => {
                                invoice_detail(item.id);
                              }}
                              color="blue"
                              title="Invoice Detail"
                              style={{ cursor: "pointer" }}
                            />
                           
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return  loading ?(
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  ) :(
    <div className="container-fluid bg-white invoice p-2">
      <div className="user-profile-container">
        <div className="user-header">
          <div className="row">
              <div className="col-sm-3 mt-5 text-center">
                  <img src={ImageUrl + user.image} alt="User Avatar" className="user-avatar" />
              </div>
              <div className="col-sm-3">

                  <h3>{user.name}</h3>
                  <p>{user.city}, {user.country}</p>
                  <div className="profile">
                  <h5>Contact Information</h5>
                  <p>
                  <FaEnvelope /> {user.email}
                  </p>
                  <p>
                  <FaPhoneAlt /> {user.mobile}
                  </p>
                  <p>
                  <FaMapMarkerAlt /> {user.address}
                  </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 p-2">
                    <div className="card px-2 py-2" style={{ cursor: "pointer" }} onClick={() => setActiveTab("invoice")}>
                      <div className="cardimage">
                        <img src={Image.TodaySale} alt="purchase" />
                      </div>
                      <div className="cardtext text-end">
                        <p className="mb-0">Invoice</p>
                        <p className="mb-0"> {invoiceList.length}</p>
                      </div>
                    </div>
                </div>  
                <div className="col-md-6 p-2">
                    <div className="card px-2 py-2" style={{ cursor: "pointer" }}  onClick={() => setActiveTab("contract")}>
                      <div className="cardimage">
                        <img src={Image.TodaySale} alt="purchase" />
                      </div>
                      <div className="cardtext text-end">
                        <p className="mb-0">Contract</p>
                        <p className="mb-0"> {contractList.length}</p>
                      </div>
                    </div>
                </div>
                <div className="col-md-6 p-2">
                  <div className="card px-2 py-2" style={{ cursor: "pointer" }}  onClick={() => setActiveTab("payment")}>
                    <div className="cardimage">
                      <img src={Image.TodaySale} alt="purchase" />
                    </div>
                    <div className="cardtext text-end">
                      <p className="mb-0">Payments</p>
                      <p className="mb-0">{paymentList.length}</p>
                    </div>
                  </div>
                </div>  
                <div className="col-md-6 p-2">
                  <div className="card px-2 py-2" style={{ cursor: "pointer" }}  onClick={() => setActiveTab("proforma")}>
                    <div className="cardimage">
                      <img src={Image.TodaySale} alt="purchase" />
                    </div>
                    <div className="cardtext text-end">
                      <p className="mb-0">Proforma</p>
                      <p className="mb-0">{proformaList.length}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
        </div>
      </div>
      <div className="user-tabs">
        <button
          className={`tab-btn ${activeTab === "invoice" ? "active" : ""}`}
          onClick={() => setActiveTab("invoice")}
        >
          Invoice
        </button>
        <button
          className={`tab-btn ${activeTab === "contract" ? "active" : ""}`}
          onClick={() => setActiveTab("contract")}
        >
          Contract
        </button>
        <button
          className={`tab-btn ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          Payments
        </button>
        <button
          className={`tab-btn ${activeTab === "proforma" ? "active" : ""}`}
          onClick={() => setActiveTab("proforma")}
        >
          Proforma
        </button> 
        <button
          className={`tab-btn ${activeTab === "sendmail" ? "active" : ""}`}
          onClick={() => sendmail(user)}
        >
          Send Mail
        </button>
      </div>
      <div className="user-tab-content">{renderTabContent()}</div>
    </div>
    </div>
  );
};

export default UserProfile;
