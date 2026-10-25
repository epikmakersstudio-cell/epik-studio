import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "./useAdminAuth";
import AdminLayout from "./AdminLayout";
import AdminSignIn from "./pages/AdminSignIn";
import Overview from "./pages/Overview";
import Photos from "./pages/Photos";
import Reviews from "./pages/Reviews";
import Messages from "./pages/Messages";
import Bookings from "./pages/Bookings";
import Availability from "./pages/Availability";

// Everything under /admin. Loaded as its own bundle, so website visitors never download it.
const AdminApp = () => (
  <AdminAuthProvider>
    <Routes>
      <Route path="signin" element={<AdminSignIn />} />
      <Route element={<AdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="photos" element={<Photos />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="messages" element={<Messages />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="availability" element={<Availability />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  </AdminAuthProvider>
);

export default AdminApp;
