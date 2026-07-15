import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BrokyIntroModal from './BrokyIntroModal'
import BrokyChatModal from './BrokyChatModal'

const Broky = () => {
    const { isPremium, user } = useAuth()
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()

    if (!user) return null

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-white shadow-2xl border-4 border-green-400 hover:scale-110 transition active:scale-95 flex items-center justify-center overflow-hidden"
                aria-label="Broky"
            >
                <img src="/broky.png" alt="Broky" className="w-12 h-12 object-contain" />
            </button>

            {modalOpen && (
                isPremium
                    ? <BrokyChatModal onClose={() => setModalOpen(false)} />
                    : <BrokyIntroModal onClose={() => setModalOpen(false)} onUpgrade={() => { setModalOpen(false); navigate('/premium') }} />
            )}
        </>
    )
}

export default Broky