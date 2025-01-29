import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to Expense Tracker</h1>
      <p className="text-xl text-white mb-8">Manage your expenses with ease and collaborate with friends</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}

