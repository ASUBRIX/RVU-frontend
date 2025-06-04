import { Navigate, Route, Routes } from 'react-router-dom'
import { adminRoutes, appRoutes, authRoutes, shopRoutes, studentRoutes, demosRoutes, initialRoutes } from '@/routes/index'
import AdminLayout from '@/layouts/AdminLayout'
import ShopLayout from '@/layouts/ShopLayout'
import InstructorLayout from '@/layouts/InstructorLayout'
import StudentLayout from '@/layouts/StudentLayout'
import OtherLayout from '@/layouts/OtherLayout'
import { useAuthContext } from '@/context/useAuthContext'

const AppRouter = (props) => {
  const { isAuthenticated } = useAuthContext()
  const homeRoute = demosRoutes.find((route) => route.path === '/home')

  return (
    <Routes>
      {/* Root path "/" -> Home page */}
      <Route path="/" element={<OtherLayout {...props}>{homeRoute?.element}</OtherLayout>} />

      {/* Auth Routes */}
      {authRoutes.map((route, idx) => (
        <Route key={route.path + idx} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />
      ))}

      {/* General (public) app routes */}
      {appRoutes
        // Filter out "/" and "/home" to avoid duplicate rendering at root
        .filter((route) => !['/', '/home'].includes(route.path))
        .map((route, idx) => (
          <Route key={route.path + idx} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />
        ))}

      {/* Shop Routes */}
      {shopRoutes.map((route, idx) => (
        <Route key={route.path + idx} path={route.path} element={<ShopLayout {...props}>{route.element}</ShopLayout>} />
      ))}

      {/* Instructor Routes
      {InstructorRoutes.map((route, idx) => (
        <Route
          key={route.path + idx}
          path={route.path}
          element={<InstructorLayout {...props}>{route.element}</InstructorLayout>}
        />
      ))} */}

      {/* Student Routes */}
      {studentRoutes.map((route, idx) => (
        <Route key={route.path + idx} path={route.path} element={<StudentLayout {...props}>{route.element}</StudentLayout>} />
      ))}

      {/* Admin Routes */}
      {adminRoutes.map((route, idx) => {
        if (route.path === '/auth/admin-login') {
          return <Route key={route.path + idx} path={route.path} element={route.element} />
        }

        return <Route key={route.path + idx} path={route.path} element={<AdminLayout {...props}>{route.element}</AdminLayout>} />
      })}

      {/* Catch all unmatched paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
