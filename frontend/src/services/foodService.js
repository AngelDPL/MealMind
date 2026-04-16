import { get } from './api'

export const searchFoods = async (query = '', lang = 'en') =>
    get(`/foods/?q=${encodeURIComponent(query)}&lang=${lang}`)

export const getCategories = async (lang = 'en') =>
    get(`/foods/categories?lang=${lang}`)