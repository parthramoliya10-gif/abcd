import { Outlet } from "react-router-dom";
import Navbar from "../Components/common/Navbar";

export default function ClientLayout() {
  return (
    <div className="web-theme">
      <Navbar />
      <Outlet />
    </div>
  );
}
