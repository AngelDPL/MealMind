import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [firstLogin, setFirstLogin] = useState(false)


    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token')
            if (token) {
                try {
                    const userData = await getMe()
                    setUser(userData)
                } catch {
                    localStorage.removeItem('token')
                    sessionStorage.removeItem('token')
                }
            }
            setLoading(false)
        }
        init()
    }, [])


    const loginUser = (token, userData, remember = false, isFirstLogin = false) => {
        if (remember) {
            localStorage.setItem('token', token)
        } else {
            sessionStorage.setItem('token', token)
        }
        setUser(userData)
        setFirstLogin(isFirstLogin)
    }


    const logoutUser = () => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        setUser(null)
        setFirstLogin(false)
    }


    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, firstLogin, setFirstLogin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)