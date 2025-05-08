import { Navigate, Route, Routes } from 'react-router-dom';
import { adminRoutes, appRoutes, authRoutes, InstructorRoutes, shopRoutes, studentRoutes, demosRoutes, initialRoutes } from '@/routes/index';
import AdminLayout from '@/layouts/AdminLayout';
import ShopLayout from '@/layouts/ShopLayout';
import InstructorLayout from '@/layouts/InstructorLayout';
import StudentLayout from '@/layouts/StudentLayout';
import OtherLayout from '@/layouts/OtherLayout';
import { useAuthContext } from '@/context/useAuthContext';


// const AppRouter = props => {
//   const {
//     isAuthenticated
//   } = useAuthContext();
//   return <Routes>
//       {(authRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />)}
//       {(appRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={isAuthenticated ? <OtherLayout {...props}>{route.element}</OtherLayout> : <Navigate to={{
//       pathname: '/auth/sign-in',
//       search: 'redirectTo=' + route.path
//     }} />} />)}
//       {(shopRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={isAuthenticated ? <ShopLayout {...props}>{route.element}</ShopLayout> : <Navigate to={{
//       pathname: '/auth/sign-in',
//       search: 'redirectTo=' + route.path
//     }} />} />)}
//       {(InstructorRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={isAuthenticated ? <InstructorLayout {...props}>{route.element}</InstructorLayout> : <Navigate to={{
//       pathname: '/auth/sign-in',
//       search: 'redirectTo=' + route.path
//     }} />} />)}
//       {(studentRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={isAuthenticated ? <StudentLayout {...props}>{route.element}</StudentLayout> : <Navigate to={{
//       pathname: '/auth/sign-in',
//       search: 'redirectTo=' + route.path
//     }} />} />)}

//       {(adminRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={isAuthenticated ? <AdminLayout {...props}>{route.element}</AdminLayout> : <Navigate to={{
//       pathname: '/auth/sign-in',
//       search: 'redirectTo=' + route.path
//     }} />} />)}
//     </Routes>;
// };


const AppRouter = props => {
  const { isAuthenticated } = useAuthContext();
  
  return (
    <Routes>
      {/* Academy component at root path */}
      <Route path="/" element={<OtherLayout {...props}>{demosRoutes.find(route => route.path === '/home').element}</OtherLayout>} />

      {/* Initial Routes (except root) */}
      {(initialRoutes || []).filter(route => route.path !== '/').map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={route.element} />
      ))}

      {/* Demo Routes (except /home since we're using it at root) */}
      {(demosRoutes || []).filter(route => route.path !== '/home').map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />
      ))}

      {/* Auth Routes */}
      {(authRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />
      ))}

      {/* App Routes */}
      {(appRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />
      ))}

      {/* Shop Routes */}
      {(shopRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<ShopLayout {...props}>{route.element}</ShopLayout>} />
      ))}

      {/* Instructor Routes */}
      {(InstructorRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<InstructorLayout {...props}>{route.element}</InstructorLayout>} />
      ))}

      {/* Student Routes */}
      {(studentRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<StudentLayout {...props}>{route.element}</StudentLayout>} />
      ))}

      {/* Admin Routes */}
      {(adminRoutes || []).map((route, idx) => (
        <Route key={idx + route.name} path={route.path} element={<AdminLayout {...props}>{route.element}</AdminLayout>} />
      ))}

      {/* Catch all route - redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};




export default AppRouter;
