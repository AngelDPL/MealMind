import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { get } from '../../services/api'

const ConfirmEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        const confirm = async () => {
            const token = searchParams.get('token')
            if (!token) { setStatus('error'); return }
            try {
                await get(`/auth/confirm-email?token=${token}`)
                setStatus('success')
            } catch {
                setStatus('error')
            }
        }
        confirm()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600)',
                backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
            <div className="absolute inset-0" />
            <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                {status === 'loading' && (
                    <>
                        <h2 className="text-xl font-bold text-gray-800">Verifying... / Verificando...</h2>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Email updated! / ¡Correo actualizado!</h2>
                        <p className="text-gray-500 text-sm mb-6">Your email has been changed successfully. / Tu correo ha sido cambiado con éxito.</p>
                        <Link to="/login" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                            Sign in / Iniciar sesión
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid link / Enlace inválido</h2>
                        <p className="text-gray-500 text-sm mb-6">The link has expired or is invalid. / El enlace ha expirado o no es válido.</p>
                        <Link to="/login" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                            Go back / Volver
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default ConfirmEmail