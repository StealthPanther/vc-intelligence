"use client";

import { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Company } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Eye, BookmarkPlus } from "lucide-react";

interface CompanyTableProps {
    data: Company[];
}

export function CompanyTable({ data }: CompanyTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns: ColumnDef<Company>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium text-primary">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "desc",
            header: "Description",
            cell: ({ row }) => <div className="max-w-[250px] md:max-w-[400px] truncate">{row.getValue("desc")}</div>,
        },
        {
            accessorKey: "website",
            header: "Website",
            cell: ({ row }) => {
                const url = row.getValue("website") as string;
                return (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {url.replace("https://", "").replace("http://", "")}
                    </a>
                );
            },
        },
        {
            accessorKey: "sector",
            header: "Sector",
            cell: ({ row }) => (
                <Badge variant="secondary">{row.getValue("sector")}</Badge>
            ),
        },
        {
            accessorKey: "stage",
            header: "Stage",
            cell: ({ row }) => (
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                    {row.getValue("stage")}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 shadow-sm hidden md:flex"
                            onClick={() => router.push(`/companies/${row.original.id}`)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 shadow-sm"
                            onClick={() => console.log("Save", row.original.id)}
                        >
                            <BookmarkPlus className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => router.push(`/companies/${row.original.id}`)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-48 text-center bg-card">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <p className="mb-2 text-lg font-medium">No companies match.</p>
                                        <p className="text-sm">Try broadening your filters or search term.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount() || 1}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
