"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { db } from "../../lib/firebase"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import DataTable from "./Table"

export default function Dashboard() {
    const [loading, setLoading] = useState(false)
    const [loadingFetch, setLoadingFetch] = useState(false)
    const { toast } = useToast()
    const user = useAuth()
    const router = useRouter()
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [paidTo, setPaidTo] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [totalExpense, setTotalExpenseOws] = useState(0)
    const [expense, setTotalExp] = useState<{id: string}[] | null>(null)
    const [totalDept, setTotalDept] = useState(0)
    useEffect(() => {
        setLoadingFetch(true)
        if (!user) {
            router.push("/login")
        } else {
            fetchExpensesOwns();
            fetchExpenseDept();
            fetchUsers();
        }
        setLoadingFetch(false)
    }, [user])


    const fetchUsers = async () => {
        const usersSnapshot = await getDocs(collection(db, "users"))
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setUsers(usersData)
    }


    const submitAddExpense = async () => {
        setLoading(true)
        if (!amount && !description && !user?.user?.uid && !paidTo) {
            toast({
                title: "Error",
                description: "Please enter all the data.",
                variant: "destructive"
            })
        }
        await addDoc(collection(db, "expenses"), { amount, description, senderId: user?.user?.uid, receiverId: paidTo, })
        toast({
            title: "Successfully",
            description: "Data Added Successfully.",
        })
        setAmount("")
        setDescription("")
        setPaidTo("")
        setLoading(false)

    }

    if (!user) {
        return <div>Loading...</div>
    }

    const fetchExpensesOwns = async () => {
        const expenses = query(collection(db, "expenses"), where("senderId", "==", user.user?.uid))
        const querySnapshot = await getDocs(expenses)
        const expensesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        calculateTotalExpense(expensesData)
    }

    const calculateTotalExpense = (expensesData: any[]) => {
        const total = expensesData.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)
        setTotalExpenseOws(total)
    }

    const fetchExpenseDept = async () => {
        const dept = query(collection(db, "expenses"), where("receiverId", "==", user.user?.uid))
        const querySnapshot = await getDocs(dept)
        const deptData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setTotalExp(deptData)
        calculateTotalDept(deptData)
    }

    const calculateTotalDept = (deptData: any[]) => {
        const total = deptData.reduce((sum, dept) => sum + Number.parseFloat(dept.amount), 0)
        setTotalDept(total)
    }

    return (
        <>
            <div className="h-full bg-gray-100 p-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Expense Tracker Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="py-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e: any) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paidTo">Paid To</Label>
                                    <Select onValueChange={setPaidTo} value={paidTo}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {!users.length && (<div>Loading....</div>)}
                                            {users.map((item) => {
                                                if (user?.user?.uid != item?.id) return (<SelectItem key={item.id} value={item.id}> {item.username} </SelectItem>)
                                            })
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="py-4">
                                <Button type="submit" className="" onClick={submitAddExpense} disabled={loading}>{loading ? "Loading ...." : "Add Expense"}</Button>
                            </div>
                        </div>

                        <div>
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold">Taking</h3>
                                <p className="text-2xl font-bold">{loadingFetch ? " Loading ....." : `$ ${totalDept.toFixed(2) || 0}`}</p>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold">giving</h3>
                                <p className="text-2xl font-bold">{loadingFetch ? " Loading ....." : `$ ${totalExpense.toFixed(2) || 0}`}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <DataTable expense={expense} />
        </>
    )
}
