"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { deleteRecipe, getUserRecipes } from "@/lib/recipe-actions"
import { getCurrentUser } from "@/lib/auth-actions"
import { Edit2, Trash2, Plus, Search, Eye } from "lucide-react"

interface Recipe {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  servings: number
  cook_time: number
  difficulty: string
  image: string
  created_at: string
}

export default function DashboardContent() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        setUser(currentUser)
        const userRecipes = await getUserRecipes()
        setRecipes(userRecipes as Recipe[])
        setFilteredRecipes(userRecipes as Recipe[])
      } catch (error) {
        console.error("Error fetching data:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus resep ini?")) {
      try {
        await deleteRecipe(id)
        setRecipes(recipes.filter((r) => r.id !== id))
        setFilteredRecipes(filteredRecipes.filter((r) => r.id !== id))
      } catch (error) {
        alert("Gagal menghapus resep")
      }
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">Memuat...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Harap login untuk mengakses dashboard</p>
        <Link href="/login">
          <Button className="bg-primary hover:bg-primary/90">Masuk</Button>
        </Link>
      </main>
    )
  }

  const totalRecipes = recipes.length

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Dashboard Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Dashboard Resep</h1>
            <p className="text-muted-foreground">Kelola dan pantau semua resep Anda</p>
          </div>
          <Link href="/add-recipe">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5" />
              Resep Baru
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Resep</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalRecipes}</div>
              <p className="text-xs text-muted-foreground mt-2">Resep yang telah dibuat</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Terakhir Diperbarui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {recipes.length > 0 ? new Date(recipes[0].created_at).toLocaleDateString("id-ID") : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Resep terbaru</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{new Set(recipes.map((r) => r.category)).size}</div>
              <p className="text-xs text-muted-foreground mt-2">Jenis kategori</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari resep..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              const filtered = recipes.filter(
                (recipe) =>
                  recipe.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
                  recipe.category.toLowerCase().includes(e.target.value.toLowerCase()),
              )
              setFilteredRecipes(filtered)
            }}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Resep</CardTitle>
        </CardHeader>
        <CardContent>
          {recipes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Nama Resep</th>
                    <th className="text-left py-4 px-4 font-semibold">Kategori</th>
                    <th className="text-left py-4 px-4 font-semibold">Porsi</th>
                    <th className="text-left py-4 px-4 font-semibold">Waktu Masak</th>
                    <th className="text-right py-4 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery ? filteredRecipes : recipes).map((recipe) => (
                    <tr key={recipe.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">{recipe.description}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-accent text-accent-foreground">{recipe.category}</Badge>
                      </td>
                      <td className="py-4 px-4 text-foreground">{recipe.servings} porsi</td>
                      <td className="py-4 px-4 text-foreground">{recipe.cook_time} min</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/recipe/${recipe.id}`}>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(recipe.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada resep. Mulai dengan membuat resep baru!</p>
              <Link href="/add-recipe">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Buat Resep Pertama
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
