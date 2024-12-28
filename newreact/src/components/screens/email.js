import React, { useState } from "react";
import axios from "../../axios";
import endpoint from "../../endpoints";
import { toast } from "react-toastify";
import {useParams } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

function EmailTemplate() {
  const { email } = useParams();
  
  const [emailData, setEmailData] = useState({
    recipient: email!=''?email:"",
    subject: "",
    body: "",
  });

  const handleEmailChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const validateEmailInputs = () => {
    if (!emailData.recipient || !emailData.subject || !emailData.body) {
      toast.error("All email fields are required.");
      return false;
    }
    return true;
  };

  const sendEmail = async () => {
    if (!validateEmailInputs()) return;

    try {
      await axios.post(`${endpoint.SEND_EMAIL}`, emailData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Email sent successfully!");
      setEmailData({ recipient: "", subject: "", body: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  };

  return (
    <div className="container-fluid product p-3 bg-white">
           <div className="card header">
        <h4 className="mb-3 mb-md-0">Send Mail </h4>
      
      </div>
       {/* Modal */}
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">

            <div className="card m-2">
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="recipient" className="form-label">
                    Recipient
                  </label>
                  <input
                    type="email"
                    id="recipient"
                    name="recipient"
                    value={emailData.recipient}
                    onChange={handleEmailChange}
                    className="form-control"
                    placeholder="Enter recipient email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleEmailChange}
                    className="form-control"
                    placeholder="Enter email subject"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="body" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    value={emailData.body}
                    onChange={handleEmailChange}
                    className="form-control"
                    rows="4"
                    placeholder="Enter email body"
                    required
                  ></textarea>
                </div>
                <button className="btn btn-primary" onClick={sendEmail}><FaPaperPlane/>&nbsp;
                  Send Email
                </button>
              </div>
            </div>
        </div>
        <div className="col-sm-4"></div>
      </div>
    </div>
  );
}

export default EmailTemplate;
