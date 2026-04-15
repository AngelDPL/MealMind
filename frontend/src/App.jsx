import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Login from './pages/Login/Login'


const PublicRoute = ({ children }) => {
	const { user, loading } = useAuth()
	if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Loading...</div>
	return user ? <Navigate to="/recipes" /> : children
}


const App = () => {
	return (
		<Routes>
			<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	)
}

export default App