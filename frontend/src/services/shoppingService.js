import { get, post, patch } from './api'

export const getShoppingList = async (planId) => get(`/shopping/${planId}`)

export const generateShoppingList = async (planId, lang = 'en') =>
    post(`/shopping/generate/${planId}?lang=${lang}`)

export const toggleShoppingItem = async (itemId) => patch(`/shopping/item/${itemId}/toggle`)