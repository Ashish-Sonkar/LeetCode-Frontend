import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Admin from "./pages/Admin"
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete"
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import AdminUpdate from "./components/AdminUpdate";
import AdminEditProblem from "./components/AdminEditProblem";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProblemPage from "./pages/ProblemPage";
import LandingPage from "./pages/LandingPage";


function App() {

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  }

  return (
    <>

      <Routes>
        <Route path="/" element={isAuthenticated ? <Homepage /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
        {/* Admin dashboard */}
        <Route path="/admin" element={isAuthenticated && user?.role === "admin" ? <Admin /> : <Navigate to="/" />} />
        {/* Create problem */}
        <Route path="/admin/create" element={isAuthenticated && user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
        {/* Delete problem */}
        <Route path="/admin/delete" element={isAuthenticated && user?.role === "admin" ? <AdminDelete /> : <Navigate to="/" />} />
        {/* Video management */}
        <Route path="/admin/video" element={isAuthenticated && user?.role === "admin" ? <AdminVideo /> : <Navigate to="/" />} />
        {/* Upload video */}
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === "admin" ? <AdminUpload /> : <Navigate to="/" />} />
        {/* Update problems */}
        <Route path="/admin/update" element={isAuthenticated && user?.role === "admin" ? <AdminUpdate /> : <Navigate to="/" />} />
        {/* Edit individual problem */}
        <Route path="/admin/update/:id" element={isAuthenticated && user?.role === "admin" ? <AdminEditProblem /> : <Navigate to="/" />} />
        {/* Problem page */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>

    </>
  )
}

export default App
