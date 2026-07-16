import useLang from '../../hooks/useLang'

const BrokyIntroModal = ({ onClose, onUpgrade }) => {
    const lang = useLang()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center flex flex-col gap-4">
                <span className="text-5xl mx-auto">🥦</span>
                <h2 className="text-2xl font-bold text-white">
                    {lang === 'es' ? '¡Hola, soy Broky!' : "Hi, I'm Broky!"}
                </h2>
                <p className="text-neutral-400 text-lg">
                    {lang === 'es'
                        ? 'Puedo crear tu plan de comidas al instante: solo hoy, toda la semana, o los días que tú elijas.'
                        : 'I can build your meal plan instantly: just today, the whole week, or whichever days you pick.'}
                </p>

                <div className="bg-neutral-800/60 rounded-xl p-4 text-left text-lg text-neutral-200 flex flex-col gap-2">
                    <p>{lang === 'es' ? 'Respeto tus calorías máximas por comida.' : 'I respect your max calories per meal.'}</p>
                    <p>{lang === 'es' ? 'Uso los ingredientes que prefieras.' : 'I use your preferred ingredients.'}</p>
                    <p>{lang === 'es' ? 'Nunca incluyo tus alergias.' : 'I never include your allergies.'}</p>
                </div>

                <button
                    onClick={onUpgrade}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition active:scale-95 border-none"
                >
                    {lang === 'es' ? 'Hazte Premium para hablar conmigo' : 'Go Premium to chat with me'}
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 rounded-xl transition border border-neutral-700"
                >
                    {lang === 'es' ? 'Ahora no' : 'Not now'}
                </button>
            </div>
        </div>
    )
}

export default BrokyIntroModal