import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableT  { expense?: { id: string, amount: number, description: string }[] }
export default function DataTable({ expense = [] }: DataTableT) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Amount</TableHead>
                        <TableHead>description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expense?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.amount}</TableCell>
                            <TableCell>{item.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <p className="mt-4 text-center text-sm text-muted-foreground">Basic table</p>
        </div>
    );
}
