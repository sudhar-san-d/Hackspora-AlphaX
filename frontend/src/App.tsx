import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from './components/Layout'
import { Skeleton } from './components/UI'
import { useApp } from './context/AppContext'
import type { Role } from './types'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const CitizenPortal = lazy(() => import('./pages/CitizenPortal'))
const CitizenDetail = lazy(() => import('./pages/CitizenDetail'))
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard'))
const OfficerDetail = lazy(() => import('./pages/OfficerDetail'))
const Verification = lazy(() => import('./pages/Verification'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Notifications = lazy(() => import('./pages/Notifications'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteLoading() {
  return <div className="min-h-[60dvh] space-y-6 p-4 sm:p-8" role="status" aria-label="Loading page"><Skeleton className="h-4 w-40"/><Skeleton className="h-10 max-w-xl"/><div className="grid gap-5 md:grid-cols-3"><Skeleton className="h-36"/><Skeleton className="h-36"/><Skeleton className="h-36"/></div><Skeleton className="h-72"/></div>
}

function Guard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { currentUser } = useApp()
  const location = useLocation()
  if (!currentUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!roles.includes(currentUser.role)) return <Navigate to={`/${currentUser.role}`} replace />
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return <Suspense fallback={<RouteLoading/>}><Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/citizen" element={<Guard roles={['citizen']}><CitizenPortal/></Guard>}/>
    <Route path="/citizen/complaints/:id" element={<Guard roles={['citizen']}><CitizenDetail/></Guard>}/>
    <Route path="/officer" element={<Guard roles={['officer']}><OfficerDashboard/></Guard>}/>
    <Route path="/officer/complaints/:id" element={<Guard roles={['officer']}><OfficerDetail/></Guard>}/>
    <Route path="/admin" element={<Guard roles={['admin']}><AdminDashboard/></Guard>}/>
    <Route path="/notifications" element={<Guard roles={['citizen','officer','admin']}><Notifications/></Guard>}/>
    <Route path="/verification/:id" element={<Verification/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes></Suspense>
}
