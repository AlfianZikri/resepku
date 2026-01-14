// Mock database for demo purposes
// In production, replace with real database/API calls

import { hash, compare } from "bcryptjs"

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
}

export interface Recipe {
  id: string
  userId: string
  title: string
  category: string
  servings: number
  cookTime: number
  difficulty: string
  image: string
  description: string
  ingredients: Array<{ id: string; name: string; amount: string; unit: string }>
  instructions: string[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  createdAt: string
}

// Mock database - in production use real database
const users: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    passwordHash: "$2a$10$YourHashedPassword", // demo password
  },
]

let recipes: Recipe[] = []
let currentSessionUserId: string | null = null

// Authentication functions
export async function registerUser(email: string, password: string, name: string) {
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Email sudah terdaftar")
  }

  const passwordHash = await hash(password, 10)
  const newUser: User = {
    id: String(users.length + 1),
    email,
    name,
    passwordHash,
  }

  users.push(newUser)
  currentSessionUserId = newUser.id
  return newUser
}

export async function loginUser(email: string, password: string) {
  const user = users.find((u) => u.email === email)
  if (!user) {
    throw new Error("Email atau password salah")
  }

  const passwordMatch = await compare(password, user.passwordHash)
  if (!passwordMatch) {
    throw new Error("Email atau password salah")
  }

  currentSessionUserId = user.id
  return user
}

export function logoutUser() {
  currentSessionUserId = null
}

export function getCurrentUser(): User | null {
  if (!currentSessionUserId) return null
  return users.find((u) => u.id === currentSessionUserId) || null
}

export function getCurrentUserId(): string | null {
  return currentSessionUserId
}

// Recipe functions
export function getUserRecipes(userId: string): Recipe[] {
  return recipes.filter((r) => r.userId === userId)
}

export function getRecipeById(id: string): Recipe | null {
  return recipes.find((r) => r.id === id) || null
}

export function getAllRecipes(): Recipe[] {
  return recipes
}

export function createRecipe(userId: string, data: Omit<Recipe, "id" | "userId" | "createdAt">): Recipe {
  const newRecipe: Recipe = {
    ...data,
    id: String(recipes.length + 1),
    userId,
    createdAt: new Date().toISOString(),
  }
  recipes.push(newRecipe)
  return newRecipe
}

export function updateRecipe(id: string, data: Partial<Omit<Recipe, "id" | "userId" | "createdAt">>) {
  const index = recipes.findIndex((r) => r.id === id)
  if (index === -1) throw new Error("Resep tidak ditemukan")
  recipes[index] = { ...recipes[index], ...data }
  return recipes[index]
}

export function deleteRecipe(id: string) {
  recipes = recipes.filter((r) => r.id !== id)
}
