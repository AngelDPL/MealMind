import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"


import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'


const PublicRoute = ({ children }) => {
	const { user, loading } = useAuth()
	if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Loading...</div>
	return user ? <Navigate to="/recipes" /> : children
}

const PrivateRoutes = ({ children }) => {
	const { user, loading } = useAuth()
	if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Loading...</div>
	return user ? children : <Navigate to="/login" />
}


const App = () => {
	return (
		<div
			className="min-h-screen relative"
			style={{
				backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundAttachment: 'fixed',
			}}
		>
			<div className="absolute inset-0 bg-black/40 z-0" />
			<div className="relative z-10 min-h-screen flex flex-col">
				<Navbar />
				<main className="flex-1">
					<Routes>
						<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
						<Route path="*" element={<Navigate to="/login" />} />
						<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
						<Route path="/recipes" element={<PrivateRoutes><div className="text-white p-8">Recipes coming soon</div></PrivateRoutes>} />
					</Routes>
				</main>
			</div>
		</div>
	)
}

export default App