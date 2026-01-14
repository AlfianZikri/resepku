"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createRecipe } from "@/lib/recipe-actions"
import { X, Plus, AlertCircle, CheckCircle, Upload } from "lucide-react"

const CATEGORIES = ["Nasi", "Sup", "Daging", "Sayuran", "Gorengan", "Seafood", "Dessert"]
const UNITS = ["gram", "ml", "sendok makan", "sendok teh", "buah", "siung", "batang", "rimpang", "lembar", "piring"]
const DIFFICULTIES = ["Mudah", "Sedang", "Sulit"]

interface Ingredient {
  id: string
  name: string
  amount: string
  unit: string
}

interface RecipeFormData {
  title: string
  description: string
  category: string
  servings: string
  cookTime: string
  difficulty: string
  image: string
  imageFile?: File
  ingredients: Ingredient[]
  instructions: string[]
}

export default function RecipeForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    category: "Nasi",
    servings: "4",
    cookTime: "20",
    difficulty: "Sedang",
    image: "",
    imageFile: undefined,
    ingredients: [{ id: "1", name: "", amount: "", unit: "gram" }],
    instructions: [""],
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: file.name,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleIngredientChange = (id: string, field: keyof Ingredient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)),
    }))
  }

  const addIngredient = () => {
    const newId = Date.now().toString()
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: newId, name: "", amount: "", unit: "gram" }],
    }))
  }

  const removeIngredient = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id),
    }))
  }

  const handleInstructionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((instr, i) => (i === index ? value : instr)),
    }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || formData.ingredients.some((i) => !i.name) || formData.instructions.some((i) => !i)) {
      setError("Harap isi semua field yang wajib")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const ingredientsData = formData.ingredients.map(({ id, ...rest }) => rest)

      const imageToUse = imagePreview || formData.image || "/handwritten-recipe.png"

      await createRecipe({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        servings: Number.parseInt(formData.servings),
        cook_time: Number.parseInt(formData.cookTime),
        difficulty: formData.difficulty,
        image: imageToUse,
        ingredients: ingredientsData,
        instructions: formData.instructions.filter((i) => i.trim()),
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      })

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        router.push("/")
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan resep")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="flex gap-3 rounded-lg bg-green-100 p-4 text-sm text-green-800 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Resep berhasil disimpan!</p>
            <p>Anda akan diarahkan ke halaman utama dalam beberapa saat</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title" className="font-semibold">
              Nama Resep
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Contoh: Nasi Goreng Spesial"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="font-semibold">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Jelaskan resep Anda secara singkat"
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="font-semibold">
                Kategori
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="servings" className="font-semibold">
                Jumlah Porsi
              </Label>
              <Input
                id="servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleInputChange}
                className="mt-2"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cookTime" className="font-semibold">
                Waktu Memasak (menit)
              </Label>
              <Input
                id="cookTime"
                name="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={handleInputChange}
                className="mt-2"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="difficulty" className="font-semibold">
                Tingkat Kesulitan
              </Label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageFile" className="font-semibold">
              Gambar Resep
            </Label>
            <div className="mt-2 space-y-3">
              <div className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition cursor-pointer">
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-semibold text-foreground">Klik untuk upload gambar</p>
                <p className="text-sm text-muted-foreground">atau seret gambar ke sini</p>
              </div>

              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("")
                      setFormData((prev) => ({ ...prev, imageFile: undefined, image: "" }))
                    }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bahan-Bahan</CardTitle>
            <Button type="button" onClick={addIngredient} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Tambah Bahan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex gap-2">
              <Input
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(ingredient.id, "name", e.target.value)}
                placeholder="Nama bahan"
                className="flex-1"
                required
              />
              <Input
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(ingredient.id, "amount", e.target.value)}
                placeholder="Jumlah"
                className="w-20"
                type="number"
                step="0.1"
                required
              />
              <select
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(ingredient.id, "unit", e.target.value)}
                className="px-3 border border-border rounded-md bg-background text-foreground"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {formData.ingredients.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeIngredient(ingredient.id)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cara Membuat</CardTitle>
            <Button type="button" onClick={addInstruction} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Tambah Langkah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.instructions.map((instruction, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 flex gap-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  placeholder="Tuliskan langkah memasak..."
                  className="flex-1"
                  rows={2}
                  required
                />
                {formData.instructions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? "Sedang Menyimpan..." : "Simpan Resep"}
        </Button>
        <Link href="/" className="flex-1">
          <Button type="button" variant="outline" size="lg" className="w-full bg-transparent">
            Batal
          </Button>
        </Link>
      </div>
    </form>
  )
}
