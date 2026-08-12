import { Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from './RequireAuth'
import AdminLayout from '../Components/layout/AdminLayout'
import LoginPage from '../pages/admin/LoginPage'
import DashboardPage from '../pages/admin/DashboardPage'
import CollectionsPage from '../pages/admin/CollectionsPage'
import BrandsPage from '../pages/admin/BrandsPage'
import ExhibitionsPage from '../pages/admin/ExhibitionsPage'
import InquiriesPage from '../pages/admin/InquiriesPage'
import SeoPage from '../pages/admin/SeoPage'
import SettingsPage from '../pages/admin/SettingsPage'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="exhibitions" element={<ExhibitionsPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="seo" element={<SeoPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}
