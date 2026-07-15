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
        <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                <Link to="/recipes" className="flex items-center gap-2 font-bold text-white text-4xl no-underline hover:opacity-90 transition">
                    🥗 <span className="hidden sm:inline tracking-wide">MealMind</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <NavLink
                        to="/recipes"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
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
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
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
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        👤 <span className="hidden lg:inline">{user.username}</span>
                    </NavLink>
                    <NavLink
                        to="/premium"
                        className={({ isActive }) =>
                            `px-3 py-2 ms-8 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-amber-400 text-white'
                                : isPremium
                                    ? 'bg-amber-400 hover:bg-amber-500'
                                    : 'text-white hover:bg-amber-400 hover:text-white'
                            }`
                        }
                    >
                        <span style={{ filter: 'grayscale(1) sepia(1) saturate(4) brightness(0.9) hue-rotate(-10deg)' }}>
                            🥦
                        </span>
                        <span className="hidden lg:inline">
                            {isPremium
                                ? ''
                                : (lang === 'es' ? 'Hazte Premium' : 'Go Premium')}
                        </span>
                    </NavLink>
                </div>

                <button
                    onClick={handleLogout}
                    className="hidden md:block text-lg font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition border-none shadow-none"
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
                <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-white/20 flex flex-col px-4 py-3 gap-1">
                    <NavLink
                        to="/recipes"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-white/20 text-white'
                                : 'text-white hover:bg-white/10 hover:text-white'
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
                                ? 'bg-white/20 text-white'
                                : 'text-white hover:bg-white/10 hover:text-white'
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
                                ? 'bg-white/20 text-white'
                                : 'text-white hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        👤 {user.username}
                    </NavLink>
                    <NavLink
                        to="/premium"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded-xl text-lg font-medium transition ${isActive
                                ? 'bg-amber-400 text-white'
                                : isPremium
                                    ? 'bg-amber-400 hover:bg-amber-500'
                                    : 'text-white hover:bg-amber-400 hover:text-white'
                            }`
                        }
                    >
                        <span style={{ filter: 'grayscale(1) sepia(1) saturate(4) brightness(0.9) hue-rotate(-10deg)' }}>
                            🥦
                        </span>{' '}
                        {isPremium ? 'Premium' : (lang === 'es' ? 'Hazte Premium' : 'Go Premium')}
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 rounded-xl text-lg font-medium text-white hover:text-white hover:bg-white/10 transition border-none shadow-none"
                    >
                        {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar