import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginWithGoogle } from '../../services/authService'
import useLang from '../../hooks/useLang'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const GoogleLoginButton = () => {
    const buttonRef = useRef(null)
    const { loginUser } = useAuth()
    const navigate = useNavigate()
    const lang = useLang()

    useEffect(() => {
        const handleCredentialResponse = async (response) => {
            try {
                const data = await loginWithGoogle(response.credential)
                loginUser(data.access_token, data.user, true, data.first_login)
                navigate('/recipes')
            } catch (err) {
                console.error('Google login failed', err)
            }
        }

        const initGoogle = () => {
            if (!window.google || !buttonRef.current) return

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            })

            window.google.accounts.id.renderButton(buttonRef.current, {
                theme: 'outline',
                size: 'large',
                width: 320,
                text: 'continue_with',
                locale: lang,
            })
        }

        if (window.google) {
            initGoogle()
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    clearInterval(interval)
                    initGoogle()
                }
            }, 100)
            return () => clearInterval(interval)
        }
    }, [lang])

    return <div ref={buttonRef} className="flex justify-center" />
}

export default GoogleLoginButton