import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useLang from '../../hooks/useLang'

const content = {
    en: {
        badge: '🥗 Smart meal planning, simplified',
        headline1: 'Plan your meals.',
        headline2: 'Eat with purpose.',
        sub: 'MealMind helps you organize your recipes, plan your week and generate your shopping list — all in one place.',
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
        sub: 'MealMind te ayuda a organizar tus recetas, planificar tu semana y generar tu lista de la compra — todo en un solo lugar.',
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
    const lang = useLang()
    const t = content[lang]

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="absolute inset-0 z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">

                <nav className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-2 mr-auto">
                        <span className="text-2xl">🥗</span>
                        <span className="text-white font-bold text-xl tracking-tight">MealMind</span>
                    </div>
                    <div className="flex gap-3 items-center ml-auto">
                        <Link
                            to="/login"
                            className="px-5 py-2 text-sm font-semibold text-white border border-white/40 rounded-xl hover:bg-white/10 transition whitespace-nowrap"
                        >
                            {t.signin}
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition whitespace-nowrap"
                        >
                            {t.cta}
                        </Link>
                    </div>
                </nav>

                <div
                    className={`flex flex-col items-center justify-center text-center px-4 py-24 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-md font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        {t.badge}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                        {t.headline1}<br />
                        <span className="text-indigo-300">{t.headline2}</span>
                    </h1>
                    <p className="p-5 text-white bg-black/40 rounded text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                        {t.sub}
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl text-base transition active:scale-95 shadow-lg"
                        >
                            {t.cta}
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl text-base transition active:scale-95 border border-white/30"
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
                                className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${200 + i * 100}ms` }}
                            >
                                <div className="text-4xl mb-4">{f.emoji}</div>
                                <h3 className="font-bold text-gray-800 text-lg mb-3">{f.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto text-center pb-6 text-white/80 text-md">
                    {t.footer}
                </div>
            </div>
        </div>
    )
}

export default Landing