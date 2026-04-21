const useLang = () => {
    const lang = navigator.language || navigator.userLanguage || 'en'
    return lang.startsWith('es') ? 'es' : 'en'
}

export default useLang