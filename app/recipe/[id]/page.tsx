"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { ArrowLeft, Clock, Users, Share2, Heart } from "lucide-react"
import { getRecipeById } from "@/lib/recipe-actions"

interface Recipe {
  id: string
  title: string
  description: string
  category: string
  servings: number
  cook_time: number
  difficulty: string
  image: string
  ingredients: Array<{ name: string; amount: string; unit: string }>
  instructions: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export default function RecipePage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const recipeId = params.id as string
    if (!recipeId) return

    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const data = await getRecipeById(recipeId)
        setRecipe(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat resep")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Memuat resep...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">{error || "Resep tidak ditemukan"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Basic Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={recipe.image || "/placeholder.svg?height=384&width=800&query=resep"}
                alt={recipe.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-4xl font-bold text-foreground mb-2">{recipe.title}</h1>
                  <p className="text-lg text-muted-foreground">{recipe.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Badge className="bg-accent text-accent-foreground text-base py-2 px-3">{recipe.category}</Badge>
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{recipe.cook_time} min memasak</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings} porsi</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                  <Heart className="w-4 h-4" />
                  Simpan Resep
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Bagikan
                </Button>
              </div>
            </div>

            {/* Ingredients */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Bahan-Bahan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-foreground">
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">Tidak ada bahan</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cara Membuat</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions && recipe.instructions.length > 0 ? (
                    recipe.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-foreground pt-1">{instruction}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">Tidak ada instruksi</li>
                  )}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Nutrition & Related */}
          <div>
            {/* Nutrition Info */}
            {recipe.nutrition && (
              <Card className="mb-8 sticky top-20">
                <CardHeader>
                  <CardTitle>Informasi Nutrisi (Per Porsi)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Kalori</p>
                    <p className="text-2xl font-bold text-primary">{recipe.nutrition.calories} kcal</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="font-semibold">{recipe.nutrition.protein}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Karbohidrat</p>
                      <p className="font-semibold">{recipe.nutrition.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lemak</p>
                      <p className="font-semibold">{recipe.nutrition.fat}g</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Recipes */}
            <Card>
              <CardHeader>
                <CardTitle>Resep Lainnya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">{/* Placeholder for related recipes logic */}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
