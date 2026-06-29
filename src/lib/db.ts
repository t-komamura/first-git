import { JSONFilePreset } from 'lowdb/node'
import { v4 as uuidv4 } from 'uuid'

export interface Ingredient {
  name: string
  amount: string
}

export interface Step {
  order: number
  text: string
}

export interface Recipe {
  id: string
  title: string
  description?: string
  category?: string
  rating?: number
  ingredients: Ingredient[]
  steps: Step[]
  tags?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

interface DbData {
  recipes: Recipe[]
}

const defaultData: DbData = { recipes: [] }

async function getDb() {
  return JSONFilePreset<DbData>('/home/user/first-git/data/db.json', defaultData)
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const db = await getDb()
  return db.data.recipes
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const db = await getDb()
  return db.data.recipes.find(r => r.id === id)
}

export async function createRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
  const db = await getDb()
  const recipe: Recipe = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.data.recipes.push(recipe)
  await db.write()
  return recipe
}

export async function updateRecipe(id: string, data: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Promise<Recipe | null> {
  const db = await getDb()
  const idx = db.data.recipes.findIndex(r => r.id === id)
  if (idx === -1) return null
  db.data.recipes[idx] = { ...db.data.recipes[idx], ...data, updatedAt: new Date().toISOString() }
  await db.write()
  return db.data.recipes[idx]
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const db = await getDb()
  const before = db.data.recipes.length
  db.data.recipes = db.data.recipes.filter(r => r.id !== id)
  await db.write()
  return db.data.recipes.length < before
}
