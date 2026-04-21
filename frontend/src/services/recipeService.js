import { get, post, put, del } from './api'

export const getRecipes = async (lang = 'en') => get(`/recipes/?lang=${lang}`)

export const createRecipe = async (data) => post('/recipes/', data)

export const updateRecipe = async (id, data) => put(`/recipes/${id}`, data)

export const deleteRecipe = async (id) => del(`/recipes/${id}`)