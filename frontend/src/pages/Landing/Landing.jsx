import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useLang from '../../hooks/useLang'

const content = {
    en: {
        badge: '🥗 Smart meal planning, simplified',
        headline1: 'Plan your meals.',
        headline2: 'Eat with purpose.',
        sub: 'MealMind helps you organize your recipes, plan your week and generate your shopping list.. all in one place.',
        cta: 'Start for free ',
        signin: 'Sign in',
        footer: '© 2026 MealMind — Made with 🥦 and code',
        features: [
            {
                emoji: '🍽️',
                title: 'Your Recipes',
                description: 'Create and organize your personal recipe collection with full nutritional breakdown — calories, protein, carbs and fat auto-calculated.',
            },
            {
                emoji: '📅',
                title: 'Weekly Planner',
                description: 'Plan your meals for the entire week. Assign breakfast, lunch and dinner for each day and keep your diet on track.',
            },
            {
                emoji: '🛒',
                title: 'Shopping List',
                description: 'Generate a smart shopping list from your weekly plan automatically. Never forget an ingredient again.',
            },
        ],
    },
    es: {
        badge: '🥗 Planificación de comidas inteligente',
        headline1: 'Planifica tus comidas.',
        headline2: 'Come con propósito.',
        sub: 'MealMind te ayuda a organizar tus recetas, planificar tu semana y generar tu lista de la compra.. todo en un solo lugar.',
        cta: 'Empieza gratis',
        signin: 'Iniciar sesión',
        footer: '© 2026 MealMind — Hecho con 🥦 y código',
        features: [
            {
                emoji: '🍽️',
                title: 'Tus Recetas',
                description: 'Crea y organiza tu colección de recetas con información nutricional completa calculada automáticamente: calorías, proteínas, carbohidratos y grasas.',
            },
            {
                emoji: '📅',
                title: 'Planificador Semanal',
                description: 'Planifica tus comidas para toda la semana. Asigna desayuno, comida y cena para cada día y mantén tu dieta bajo control.',
            },
            {
                emoji: '🛒',
                title: 'Lista de la Compra',
                description: 'Genera una lista de la compra inteligente desde tu plan semanal automáticamente. No olvides ningún ingrediente.',
            },
        ],
    },
}

const Landing = () => {
    const [visible, setVisible] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const lang = useLang()
    const t = content[lang]

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 relative overflow-hidden">

            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/85 to-neutral-950" />

            <div className="relative z-10 flex flex-col min-h-screen">

                <nav className="relative">
                    <div className="flex items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-2 mr-auto">
                            <span className="text-2xl">🥗</span>
                            <span className="text-white font-bold text-4xl tracking-tight">MealMind</span>
                        </div>

                        <div className="hidden sm:flex gap-3 items-center ml-auto">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-xl font-semibold text-white border border-neutral-700 rounded-xl hover:bg-neutral-800 transition whitespace-nowrap"
                            >
                                {t.signin}
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 text-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition whitespace-nowrap"
                            >
                                {t.cta}
                            </Link>
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="sm:hidden text-white text-3xl bg-transparent border-none shadow-none p-1"
                            aria-label="Menu"
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className="sm:hidden bg-neutral-950 border-t border-neutral-800 flex flex-col px-6 py-4 gap-2">
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="px-5 py-2.5 text-lg font-semibold text-white border border-neutral-700 rounded-xl hover:bg-neutral-800 transition text-center"
                            >
                                {t.signin}
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="px-5 py-2.5 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition text-center"
                            >
                                {t.cta}
                            </Link>
                        </div>
                    )}
                </nav>

                <div
                    className={`flex flex-col items-center justify-center text-center px-4 py-24 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    <div className="inline-block bg-orange-500/10 text-orange-400 text-2xl font-semibold px-4 py-1.5 rounded-full mb-6 border border-orange-500/30">
                        {t.badge}.
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
                        {t.headline1}<br />
                        <span className="text-orange-400">{t.headline2}</span>
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                        {t.sub}
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-base transition active:scale-95 shadow-lg"
                        >
                            {t.cta}
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-2xl text-base transition active:scale-95 border border-neutral-700"
                        >
                            {t.signin}
                        </Link>
                    </div>
                </div>

                <div className="px-6 pb-20 max-w-5xl mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {t.features.map((f, i) => (
                            <div
                                key={i}
                                className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-6 transition-all duration-700 hover:border-neutral-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${200 + i * 100}ms` }}
                            >
                                <div className="text-4xl mb-4">{f.emoji}</div>
                                <h3 className="font-bold text-white text-xl mb-3">{f.title}</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto text-center pb-6 text-neutral-500 text-md">
                    {t.footer}
                </div>
            </div>
        </div>
    )
}

export default Landing