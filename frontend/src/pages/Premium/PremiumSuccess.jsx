import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useLang from '../../hooks/useLang'

const PremiumSuccess = () => {
    const [status, setStatus] = useState('loading')
    const { refreshUser } = useAuth()
    const navigate = useNavigate()
    const lang = useLang()

    useEffect(() => {
        const confirm = async () => {
            try {
                await refreshUser()
                setStatus('success')
            } catch {
                setStatus('error')
            }
        }
        confirm()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="relative z-10 bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">

                {status === 'loading' && (
                    <>
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-black text-lg font-medium">
                            {lang === 'es' ? 'Confirmando tu suscripción...' : 'Confirming your subscription...'}
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <span className="[filter:grayscale(1)_sepia(1)_saturate(4)_hue-rotate(-10deg)]">
                                🥦
                        </span>
                        <h1 className="text-2xl font-bold text-black mt-3">
                            {lang === 'es' ? '¡Bienvenido a Premium!' : 'Welcome to Premium!'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {lang === 'es'
                                ? 'Tu prueba gratis de 7 días ha comenzado. Ya puedes usar el planificador con IA.'
                                : 'Your 7-day free trial has started. You can now use the AI meal planner.'}
                        </p>
                        <button
                            onClick={() => navigate('/meal-planner')}
                            className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                        >
                            {lang === 'es' ? 'Ir al planificador' : 'Go to planner'}
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <span className="text-5xl">⚠️</span>
                        <h1 className="text-2xl font-bold text-black mt-3">
                            {lang === 'es' ? 'Algo no salió bien' : 'Something went wrong'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {lang === 'es'
                                ? 'No pudimos confirmar tu suscripción. Si el pago se completó, se activará en unos minutos.'
                                : "We couldn't confirm your subscription. If the payment went through, it will activate shortly."}
                        </p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition border-none"
                        >
                            {lang === 'es' ? 'Ir a mi perfil' : 'Go to my profile'}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default PremiumSuccess