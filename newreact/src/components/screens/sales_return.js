import React, { useState } from "react";
import * as Image from "../image";

function Sales_return() {
  const [activeTab, setActiveTab] = useState("sale_entry");

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container-fluid sale p-3 bg-white">
      <div className="card">
        <h4>Sales Return</h4>
        <div className="cardmenu">
          <div className="icons">
            <a href="#" className="icon">
              <img src={Image.Newfile} alt="New" />
              <span>New</span>
            </a>
            <a href="#" className="icon">
              <img src={Image.Save} alt="Save" />
              <span>Save</span>
            </a>
            <a href="#" className="icon">
              <img src={Image.Print} alt="Print" />
              <span>Print</span>
            </a>
            <a href="#" className="icon">
              <img src={Image.Delete} alt="Delete" />
              <span>Delete</span>
            </a>
            <a href="#" className="icon">
              <img src={Image.Close} alt="Close" />
              <span>Close</span>
            </a>
          </div>
        </div>
      </div>
      <div className="container-fluid saletab">
        <div className="row">
          <div
            role="button"
            className={`col-md-2 saletabdiv ${
              activeTab === "sale_entry" ? "active" : ""
            }`}
            onClick={() => handleTabClick("sale_entry")}>
            <p>Return Entry</p>
          </div>
          <div
            role="button"
            className={`col-md-2 saletabdiv ${
              activeTab === "find_sale" ? "active" : ""
            }`}
            onClick={() => handleTabClick("find_sale")}>
            <p>Find Return</p>
          </div>
        </div>
      </div>
      {activeTab === "sale_entry" && (
        <div id="sale_entry">
          <div className="row p-3">
            <div className="col-md-3 field_div">
              <label>Invoice Number</label>
              <input type="text" placeholder="Invoice Number" />
            </div>
            <div className="col-md-3 field_div">
              <label>Invoice Date</label>
              <input type="date" placeholder="Invoice Date" />
            </div>
            <div className="col-md-3 field_div">
              <label>Invoice Status</label>
              <input type="text" placeholder="Invoice Status" />
            </div>
            <div className="col-md-3 field_div">
              <label>Customer No</label>
              <input type="text" placeholder="Customer No" />
            </div>
            <div className="col-md-3 field_div">
              <label>Sales Return Date</label>
              <input type="date" placeholder="Sales Return Date" />
            </div>
            <div className="col-md-3 field_div">
              <label>GST No</label>
              <input type="text" placeholder="GST No" />
            </div>
            <div className="col-md-3 field_div">
              <label>Customer Name</label>
              <select placeholder="Customer Name">
                <option value="0">Customer 1</option>
                <option value="1">Customer 2</option>
                <option value="2">Customer 3</option>
              </select>
            </div>
            <div className="col-md-3 field_div">
              <label>Customer Place</label>
              <input type="text" placeholder="Customer Place" />
            </div>
            <div className="col-md-3 field_div">
              <label>LR Number</label>
              <input type="text" placeholder="LR Number" />
            </div>
            <div className="col-md-3 field_div">
              <label>LR Date</label>
              <input type="date" placeholder="LR Date" />
            </div>
            <div className="col-md-3 field_div">
              <label>GE Number</label>
              <input type="text" placeholder="GE Number" />
            </div>
            <div className="col-md-3 field_div">
              <label>GE Date</label>
              <input type="date" placeholder="GE Date" />
            </div>
          </div>
          <div className="table-responsive">
            {" "}
            <table className="table table-bordered table-striped" responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Items</th>
                  <th>Description</th>
                  <th>UOM</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Gross</th>
                  <th>Dis%</th>
                  <th>Packing</th>
                  <th>Freight</th>
                  <th>CGST%</th>
                  <th>SGST%</th>
                  <th>IGST%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>xxxxxxxxx</td>
                  <td>Lorem Ipsum</td>
                  <td>2564</td>
                  <td>8</td>
                  <td>89654</td>
                  <td>1,22,5525</td>
                  <td>10</td>
                  <td>Gujarat</td>
                  <td>5</td>
                  <td>8</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>xxxxxxxxx</td>
                  <td>Lorem Ipsum</td>
                  <td>2564</td>
                  <td>8</td>
                  <td>89654</td>
                  <td>1,22,5525</td>
                  <td>10</td>
                  <td>Gujarat</td>
                  <td>5</td>
                  <td>8</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>xxxxxxxxx</td>
                  <td>Lorem Ipsum</td>
                  <td>2564</td>
                  <td>8</td>
                  <td>89654</td>
                  <td>1,22,5525</td>
                  <td>10</td>
                  <td>Gujarat</td>
                  <td>5</td>
                  <td>8</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>xxxxxxxxx</td>
                  <td>Lorem Ipsum</td>
                  <td>2564</td>
                  <td>8</td>
                  <td>89654</td>
                  <td>1,22,5525</td>
                  <td>10</td>
                  <td>Gujarat</td>
                  <td>5</td>
                  <td>8</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>xxxxxxxxx</td>
                  <td>Lorem Ipsum</td>
                  <td>2564</td>
                  <td>8</td>
                  <td>89654</td>
                  <td>1,22,5525</td>
                  <td>10</td>
                  <td>Gujarat</td>
                  <td>5</td>
                  <td>8</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row p-3">
            <div className="col-md-3 field_div">
              <label>Gross Amount</label>
              <input type="text" placeholder="Gross Amount" />
            </div>
            <div className="col-md-3 field_div">
              <label>Discount %</label>
              <input type="text" placeholder="Discount %" />
            </div>
            <div className="col-md-3 field_div">
              <label>Packing</label>
              <input type="text" placeholder="Packing" />
            </div>
            <div className="col-md-3 field_div">
              <label>Freight</label>
              <input type="text" placeholder="Freight" />
            </div>
            <div className="col-md-3 field_div">
              <label>Other Amount</label>
              <input type="text" placeholder="Other Amount" />
            </div>
            <div className="col-md-3 field_div">
              <label>Taxable %</label>
              <input type="text" placeholder="Taxable %" />
            </div>
            <div className="col-md-3 field_div">
              <label>SGST %</label>
              <input type="text" placeholder="SGST %" />
            </div>
            <div className="col-md-3 field_div">
              <label>CGST %</label>
              <input type="text" placeholder="CGST %" />
            </div>
          </div>
        </div>
      )}
      {activeTab === "find_sale" && (
        <div id="find_sale" className="p-5">
          <h4 className="text-secondary">Find Sale</h4>
        </div>
      )}
    </div>
  );
}

export default Sales_return;
