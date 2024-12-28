import React, { useState, useRef, useEffect } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import jsPDF from "jspdf";
import moment from "moment";
import html2canvas from "html2canvas";
import * as Image from "../image";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaShippingFast,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaIdCard,
  FaPrint,
  FaDownload,
  FaRegEnvelopeOpen,
  FaArrowLeft,
  FaDollarSign ,
} from "react-icons/fa";
import printJS from "print-js";
const Invoice_Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const [InvoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    get_Invoice();
  }, []);

  const get_Invoice = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${endpoint.PROFORMA_INVOICE_DETAILS}?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const invoicedata = res.data.data.find((item) => item.id == id);
      setLoading(false);
      setInvoiceList(invoicedata);
    } catch (error) {
      setLoading(false);
      console.error("Catch error:", error);
    }
  };

  const handleDownloadPdf = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
      })
      .catch((err) => {
        console.error("Failed to generate PDF", err);
      });
  };
  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current;
      printJS({
        printable: printContent,
        type: "html",
        style: `
          .table {
            margin: 1%;
            width: 100% !important;
            text-align: center;
            border-collapse: collapse;
          }
          thead th {
            background-color: #5a28ab;
            color: #fff;
            font-size: 0.9rem !important;
            padding: 0.75rem !important;
            font-weight: normal;
            border: 1px solid #5a28ab;
            white-space: nowrap;
          }
          tbody td {
            color: #5a28ab;
            white-space: nowrap;
            font-size: 0.9rem !important;
            border: 1px solid #5a28ab;
            padding: 0.75rem !important;
          }
          h6 {
            margin: 0.5rem 0rem;
            font-size: 0.8rem;
            line-height: 1rem;
          }
          svg {
            color: #5a28ab;
            width: 0.7rem;
            height: 0.7rem;
            margin-right: 0.3rem;
          }
          h5 {
            margin: 0.5rem 0rem;
            color: #5a28ab;
            font-size: 1rem;
            font-weight: 600;
          }
          label {
            font-weight: 500;
            margin-bottom: 0.25rem;
          }
          .terms-section {
            background: #f1eef5;
            border-radius: 0.5rem;
            padding: 1.5rem;
            width:100% !important;
          }
          .terms-title {
            font-size: 1rem;
            color: #35188e;
            margin-bottom: 0.5rem;
            font-weight: bold;
          }
          .terms-content {
            font-size: 0.8rem;
            color: #000;
          }
          .summary-item {
            font-size: 0.8rem;
            color: #5a28ab;
            margin-bottom: 0;
          }
          .grand-total {
            font-size: 1rem;
            color: #35188e;
            font-weight: 600;
          }
          }
        `,
        documentTitle: "Invoice",
      });
    } else {
      console.error("Print reference is not available.");
    }
  };
  const handleGoBack = () => {
    navigate(-1);
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
    <div className="container-fluid bg-white invoice p-2">
      <div className="row">
        <div className="col-md-6">
          <FaArrowLeft onClick={handleGoBack} role="button" />
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end mb-3">
            <button className="downloadbutton me-2" onClick={handleDownloadPdf}>
              <FaDownload />
              Download PDF
            </button>
            <button className="printbutton" onClick={handlePrint}>
              <FaPrint />
              Print
            </button>
          </div>
        </div>
      </div>
      <hr />

      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="p-3" ref={invoiceRef}>
          <div className="col-md-12 header">
            <div className="d-flex justify-content-start align-items-center mb-1">
              <img src={Image.Logo} alt="Logo" />
            </div>
            <p className="mb-0">
              <FaRegEnvelopeOpen />
              beaconcoders@gmail.com
            </p>
            <p className="mb-0">
              <FaPhoneAlt />
              1234567890
            </p>
            <p className="mb-0">
              <FaMapMarkerAlt />
              Office 1603 Cloud 9 S3 Tower Vaishali Ghaziabad UP, 201010
            </p>
          </div>
          <hr />
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <h5>
                <FaUser />
                Bill To:
              </h5>
              <>
                <h6>
                  <FaUser
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.billing_name}
                </h6>
                <h6>
                  <FaMapMarkerAlt
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.billing_address}, {InvoiceList?.billing_city},
                  {InvoiceList?.billing_state}, {InvoiceList?.billing_country}
                  {InvoiceList?.billing_pincode}
                </h6>
                <h6>
                  <FaPhoneAlt
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.billing_mobile}
                </h6>
                <h6>
                  <FaIdCard
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.billing_gstin}
                </h6>
              </>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <h5>
                <FaShippingFast />
                Ship To:
              </h5>
              <>
                <h6>
                  <FaUser
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.shipping_name}
                </h6>
                <h6>
                  <FaMapMarkerAlt
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.shipping_address}, {InvoiceList?.shipping_city},
                  {InvoiceList?.shipping_state}, {InvoiceList?.shipping_country}
                  {InvoiceList?.shipping_pincode}
                </h6>
                <h6>
                  <FaPhoneAlt
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.shipping_mobile}
                </h6>
                <h6>
                  <FaIdCard
                    style={{
                      width: "0.8rem",
                      height: "0.8rem",
                      marginRight: "0.3rem",
                    }}
                  />
                  {InvoiceList?.shipping_gstin}
                </h6>
              </>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <h5>
                <FaCalendarAlt />
                Invoice
              </h5>
              <div className="row">
                <div className="col-md-12">
                  <p>Invoice No: #{InvoiceList?.proforma_invoice_number}</p>
                </div>
                <div className="col-md-6">
                  <p>
                    Invoice Date:
                    <br /> {toDate(InvoiceList?.proforma_invoice_date)}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    Due Date:
                    <br /> {toDate(InvoiceList?.due_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <table className="table table-bordered mx-0 w-100">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Product</th>
                <th>HSN Code</th>
                <th>QTY</th>
                <th>Price (&#8377;)</th>
                <th>Discount (&#8377;)</th>
                <th>Tax Value</th>
                <th>Total Amt (&#8377;)</th>
              </tr>
            </thead>
            <tbody>
            {InvoiceList.details?.map((prod, index) => (
              <tr key={prod.id || index}>
                <td>{++index}</td>
                <td>{prod.description}</td>
                <td>{prod.hsn_code || 'N/A'}</td>
                <td>{prod.quantity || 0}</td>
                <td>&#8377; {prod.unit_price || '0.00'}</td>
                <td>&#8377; {prod.discount || '0.00'}</td>
                <td>{prod.taxable_value ? `${prod.taxable_value}` : '0.00'}</td>
                <td>&#8377; {prod.total_value || '0.00'}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <hr />
          <div className="row mx-2 my-4 terms-section">
            <div className="col-md-9">
              <h5 className="terms-title">Terms & Conditions</h5>
              <p className="terms-content">
                Please review the terms and conditions before proceeding. All
                payments are non-refundable, and applicable taxes will be
                charged as per the prevailing rates.
              </p>
            </div>
            <div className="col-md-3">
              <h6 className="text-end summary-item">
                Sub Total: &#8377; {InvoiceList?.subtotal}
              </h6>
              <h6 className="text-end summary-item">
                Total Discount: &#8377;{" "}
                {InvoiceList?.discount != null ? InvoiceList?.discount : "0.00"}
              </h6>
              <h6 className="text-end summary-item">
                Tax Amount: &#8377;{" "}
                {InvoiceList?.total_taxable_value != null
                  ? InvoiceList?.total_taxable_value
                  : "0.00"}
              </h6>
              <hr className="summary-divider" />
              <h6 className="text-end grand-total">
                Grand Total: &#8377; {InvoiceList?.grand_total}
              </h6>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice_Preview;
