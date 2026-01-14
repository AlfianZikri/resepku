import { redirect } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import RecipeForm from "@/components/recipe-form"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-actions"
import { ArrowLeft } from "lucide-react"

export default async function AddRecipePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Tambah Resep Baru</h1>
            <p className="text-muted-foreground">Bagikan resep favorit Anda dengan komunitas kami</p>
          </div>

          <RecipeForm />
        </div>
      </main>
    </div>
  )
}
