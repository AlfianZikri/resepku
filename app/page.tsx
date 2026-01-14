"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import RecipeGrid from "@/components/recipe-grid"
import { Plus, Search } from "lucide-react"
import { getAllRecipes } from "@/lib/recipe-actions"
import type { Recipe } from "@/lib/auth"

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "1",
    userId: "demo",
    title: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, udang, dan sayuran segar",
    category: "Nasi",
    servings: 4,
    cookTime: 20,
    difficulty: "Mudah",
    image: "/nasi-goreng-spesial.jpg",
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "demo",
    title: "Soto Ayam Kuning",
    description: "Sup tradisional dengan kunyit, jahe, dan daging ayam",
    category: "Sup",
    servings: 6,
    cookTime: 45,
    difficulty: "Sedang",
    image: "/soto-ayam-kuning.jpg",
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "demo",
    title: "Rendang Daging",
    description: "Daging sapi dengan santan dan rempah-rempah pilihan",
    category: "Daging",
    servings: 8,
    cookTime: 90,
    difficulty: "Sulit",
    image: "/rendang-daging.jpg",
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    userId: "demo",
    title: "Gado-Gado",
    description: "Sayuran dengan kacang dan telur rebus, saus kacang kental",
    category: "Sayuran",
    servings: 2,
    cookTime: 30,
    difficulty: "Mudah",
    image: "/gado-gado.png",
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    userId: "demo",
    title: "Lumpia Shanghai",
    description: "Lumpia goreng dengan isi daging, sayuran, dan bihun",
    category: "Gorengan",
    servings: 4,
    cookTime: 60,
    difficulty: "Sedang",
    image: "/lumpia-shanghai.jpg",
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    userId: "demo",
    title: "Pempek Palembang",
    description: "Pempek dengan kuah cuko yang pedas dan gurih",
    category: "Seafood",
    servings: 4,
    cookTime: 40,
    difficulty: "Sedang",
    image: "/pempek-palembang.jpg",
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    createdAt: new Date().toISOString(),
  },
]

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const userRecipes = await getAllRecipes()
        const combinedRecipes = [...SAMPLE_RECIPES, ...userRecipes]
        setRecipes(combinedRecipes)
      } catch (error) {
        console.error("Failed to fetch recipes:", error)
        setRecipes(SAMPLE_RECIPES)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-8 md:p-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">ResepKu</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Kelola koleksi resep favorit Anda dan temukan inspirasi kuliner baru setiap hari.
            </p>
            <Link href="/add-recipe">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-5 h-5" />
                Tambah Resep Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari resep..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Cari berdasarkan nama atau deskripsi resep</p>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat resep...</p>
          </div>
        ) : (
          <RecipeGrid searchQuery={searchQuery} recipes={recipes} />
        )}
      </main>
    </div>
  )
}
