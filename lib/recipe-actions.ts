"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth-actions"

export interface RecipeData {
  title: string
  category: string
  description: string
  servings: number
  cook_time: number
  difficulty: string
  image: string
  ingredients: Array<{ id: string; name: string; amount: string; unit: string }>
  instructions: string[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export async function createRecipe(data: RecipeData) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Anda harus login terlebih dahulu")
  }

  const supabase = await createClient()

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title: data.title,
      category: data.category,
      description: data.description,
      servings: data.servings,
      cook_time: data.cook_time,
      difficulty: data.difficulty,
      image: data.image,
      ingredients: data.ingredients,
      instructions: data.instructions,
      nutrition: data.nutrition,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return recipe
}

export async function getRecipeById(id: string) {
  const supabase = await createClient()

  const { data: recipe, error } = await supabase.from("recipes").select("*").eq("id", id).single()

  if (error) {
    throw new Error(error.message)
  }

  return recipe
}

export async function getUserRecipes() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Anda harus login terlebih dahulu")
  }

  const supabase = await createClient()

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return recipes || []
}

export async function getAllRecipes() {
  const supabase = await createClient()

  const { data: recipes, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return recipes || []
}

export async function updateRecipe(id: string, data: Partial<RecipeData>) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Anda harus login terlebih dahulu")
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: recipe } = await supabase.from("recipes").select("user_id").eq("id", id).single()

  if (recipe?.user_id !== user.id) {
    throw new Error("Anda tidak memiliki izin untuk mengubah resep ini")
  }

  const { data: updatedRecipe, error } = await supabase.from("recipes").update(data).eq("id", id).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedRecipe
}

export async function deleteRecipe(id: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Anda harus login terlebih dahulu")
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: recipe } = await supabase.from("recipes").select("user_id").eq("id", id).single()

  if (recipe?.user_id !== user.id) {
    throw new Error("Anda tidak memiliki izin untuk menghapus resep ini")
  }

  const { error } = await supabase.from("recipes").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function searchRecipes(query: string, category?: string) {
  const supabase = await createClient()

  let queryBuilder = supabase.from("recipes").select("*")

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  const { data: recipes, error } = await queryBuilder.order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return recipes || []
}
