import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/screens/dashboard";
import CMS from "../components/screens/CMS";
import CMScontent from "../components/screens/CMScontent";

import Setting from "../components/screens/setting";
import Login from "../components/screens/login";
import Client from "../components/screens/client";

import Enquiry from "../components/screens/enquiry";
import Feedback from "../components/screens/feedback";
import Career from "../components/screens/Career";
import News from "../components/screens/news";
import Interest from "../components/screens/interest";
const AppRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/cms" element={<CMS />} />
        <Route path="/cms-content" element={<CMScontent />} />
        <Route path="/client" element={<Client />} />
        <Route path="/career" element={<Career />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/news" element={<News />} />
        <Route path="/interest" element={<Interest />} />
        <Route path="/settings" element={<Setting />} />
      
      </Routes>
    </>
  );
};

export default AppRoute;
