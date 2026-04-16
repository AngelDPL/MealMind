import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    if (!user) return null

    return (
        <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-white text-lg">
                    🥗 <span className="hidden sm:inline tracking-wide">MealMind</span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/recipes"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-sm font-medium transition ${
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        🍽️ <span className="hidden sm:inline">Recipes</span>
                    </NavLink>
                    <NavLink
                        to="/meal-planner"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-sm font-medium transition ${
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        📅 <span className="hidden sm:inline">Planner</span>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-sm font-medium transition ${
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        👤 <span className="hidden sm:inline">{user.username}</span>
                    </NavLink>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition border-none shadow-none"
                >
                    Sign out
                </button>
            </div>
        </nav>
    )
}

export default Navbar