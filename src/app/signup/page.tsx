"use client"

import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { auth, db } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "../../hooks/useAuth"

export default function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (user && !loading) {
            router.push("/dashboard")
        }
    }, [user, loading, router])

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await setDoc(doc(db, "users", userCredential.user.uid), {
                username,
                email,
                userid:userCredential.user.uid
            })
            // The user will be automatically redirected to the dashboard
            // due to the useEffect hook watching the user state
        } catch (error: any) {
            console.error("Signup error:", error)
            if (error.code === "auth/email-already-in-use") {
                setError("This email is already in use. Please try a different one.")
            } else if (error.code === "auth/weak-password") {
                setError("Password is too weak. Please use a stronger password.")
            } else {
                setError("Failed to create an account. Please try again.")
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (user) {
        return null // This will prevent a flash of the signup form before redirecting
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Full Name</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Choose a unique username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Choose a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

