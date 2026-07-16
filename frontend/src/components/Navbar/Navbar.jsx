import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useLang from '../../hooks/useLang'

const Navbar = () => {
    const { user, logoutUser, isPremium } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()
    const lang = useLang()

    const handleLogout = () => {
        setMenuOpen(false)
        logoutUser()
        navigate('/')
    }

    const closeMenu = () => setMenuOpen(false)

    if (!user) return null

    return (
        <nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                <Link to="/recipes" className="flex items-center gap-2 font-bold text-white text-4xl no-underline hover:opacity-90 transition">
                    🥗 <span className="hidden sm:inline tracking-wide">MealMind</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <NavLink
                        to="/recipes"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500/15 text-orange-400'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            }`
                        }
                    >
                        🍽️ <span className="hidden lg:inline">
                            {lang === 'es' ? 'Recetas' : 'Recipes'}
                        </span>
                    </NavLink>
                    <NavLink
                        to="/meal-planner"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500/15 text-orange-400'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            }`
                        }
                    >
                        📅 <span className="hidden lg:inline">
                            {lang === 'es' ? 'Planificador' : 'Planner'}
                        </span>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500/15 text-orange-400'
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            }`
                        }
                    >
                        👤 <span className="hidden lg:inline">{user.username}</span>
                    </NavLink>
                    <NavLink
                        to="/premium"
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 px-3 py-2 ms-8 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500 text-white'
                                : isPremium
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                    : 'text-neutral-300 hover:bg-orange-500 hover:text-white border border-neutral-700 hover:border-orange-500'
                            }`
                        }
                    >
                        <span className="hidden lg:inline">
                            {isPremium
                                ? 'Premium'
                                : (lang === 'es' ? 'Hazte Premium' : 'Go Premium')}
                        </span>
                    </NavLink>
                </div>

                <button
                    onClick={handleLogout}
                    className="hidden md:block text-lg font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 rounded-xl transition shadow-none"
                >
                    <span className="hidden lg:inline">{lang === 'es' ? 'Cerrar sesión' : 'Sign out'}</span>
                    <span className="lg:hidden">{lang === 'es' ? 'Salir' : 'Out'}</span>
                </button>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white text-3xl bg-transparent border-none shadow-none p-1"
                    aria-label="Menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-neutral-950 border-t border-neutral-800 flex flex-col px-4 py-3 gap-1">
                    <NavLink
                        to="/recipes"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500/15 text-orange-400'
                                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                            }`
                        }
                    >
                        🍽️ {lang === 'es' ? 'Recetas' : 'Recipes'}
                    </NavLink>
                    <NavLink
                        to="/meal-planner"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500/15 text-orange-400'
                                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                            }`
                        }
                    >
                        📅 {lang === 'es' ? 'Planificador' : 'Planner'}
                    </NavLink>
                    <NavLink
                        to="/profile"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500/15 text-orange-400'
                                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                            }`
                        }
                    >
                        👤 {user.username}
                    </NavLink>
                    <NavLink
                        to="/premium"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-orange-500 text-white'
                                : isPremium
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                    : 'text-neutral-300 hover:bg-orange-500 hover:text-white border border-neutral-700'
                            }`
                        }
                    >
                        <img src="/broky.png" alt="Broky" className="w-5 h-5 object-contain shrink-0" />
                        {isPremium ? 'Premium' : (lang === 'es' ? 'Hazte Premium' : 'Go Premium')}
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 rounded-xl text-lg font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition border-none shadow-none"
                    >
                        {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar