import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"


import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Recipes from './pages/Recipes/Recipes'
import MealPlanner from './pages/MealPlanner/MealPlanner'
import MealPlanDetail from './pages/MealPlanDetail/MealPlanDetail'
import Shopping from './pages/Shopping/Shopping'
import Profile from './pages/Profile/Profile'


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
			<div className="absolute inset-0 z-0" />
			<div className="relative z-10 min-h-screen flex flex-col">
				<Navbar />
				<main className="flex-1">
					<Routes>
						<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
						<Route path="*" element={<Navigate to="/login" />} />
						<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
						<Route path="/recipes" element={<PrivateRoutes><Recipes /></PrivateRoutes>} />
						<Route path="/meal-planner" element={<PrivateRoutes><MealPlanner /></PrivateRoutes>} />
						<Route path="/meal-planner/:planId" element={<PrivateRoutes><MealPlanDetail /></PrivateRoutes>} />
						<Route path="/shopping/:planId" element={<PrivateRoutes><Shopping /></PrivateRoutes>} />
						<Route path="/profile" element={<PrivateRoutes><Profile /></PrivateRoutes>} />
					</Routes>
				</main>
			</div>
		</div>
	)
}

export default App