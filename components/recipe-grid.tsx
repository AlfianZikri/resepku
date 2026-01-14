"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/lib/auth"
import { Clock, Users } from "lucide-react"

// Default sample recipes for demo
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

const CATEGORIES = ["Semua", "Nasi", "Sup", "Daging", "Sayuran", "Gorengan", "Seafood", "Dessert"]

interface RecipeGridProps {
  searchQuery: string
  recipes?: Recipe[]
}

export default function RecipeGrid({ searchQuery, recipes = [] }: RecipeGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  const allRecipes = recipes.length > 0 ? recipes : SAMPLE_RECIPES

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "Semua" || recipe.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, allRecipes])

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div className="w-full h-48 bg-muted overflow-hidden">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className="w-fit bg-accent text-accent-foreground">{recipe.category}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} porsi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">Tidak ada resep yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
