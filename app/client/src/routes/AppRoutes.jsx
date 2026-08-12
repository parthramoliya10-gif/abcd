import { Routes, Route } from 'react-router-dom'
import AdminRoutes from './AdminRoutes'
import ClientLayout from '../layouts/ClientLayout'
import Home from '../pages/client/Home'
import AboutPage from '../pages/client/AboutPage'
import OurBrandsPage from '../pages/client/OurBrandsPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="AboutPage" element={<AboutPage />} />
        <Route path="our-brand" element={<OurBrandsPage />} />
      </Route>
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}