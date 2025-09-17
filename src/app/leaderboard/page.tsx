"use client"

import { useMemo, useState } from 'react'
import { useLeaderboard } from '@/hooks/use-leaderboard'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import type { LeaderboardRow } from '@/lib/api/api.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/site-header'

export default function LeaderboardPage() {
  const { data, isLoading, error } = useLeaderboard()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'count', desc: true }])

  const columns = useMemo<ColumnDef<LeaderboardRow>[]>(() => [
    {
      accessorKey: 'rank',
      header: '#',
      cell: ({ row }) => <span className="font-medium">{row.original.rank}</span>,
      size: 40,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-2">
          User
          <ArrowUpDown className="h-4 w-4 ml-1" />
        </Button>
      ),
      cell: ({ row }) => {
        const r = row.original as { name: string; avatar: string | null }
        const initials = r.name.split(/\s+/).slice(0,2).map(s => s[0]).join('').toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <span className="font-medium">{r.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'count',
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-2">
          Palindromes
          <ArrowUpDown className="h-4 w-4 ml-1" />
        </Button>
      ),
      cell: ({ row }) => <span className="tabular-nums font-semibold">{row.original.count}</span>,
    }
  ], [])

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'count', desc: true }] },
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader pageTitle="Leaderboard" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Leaderboard</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-destructive">Error loading leaderboard</p>}
        {!isLoading && !error && (
          <div className="rounded-lg border border-amber-500/70 dark:border-amber-400/60 shadow-sm max-w-3xl bg-background">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(hg => (
                  <TableRow key={hg.id}>
                    {hg.headers.map(header => (
                      <TableHead key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                      No data yet
                    </TableCell>
                  </TableRow>
                )}
                {table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-amber-50/60 dark:hover:bg-amber-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:focus-visible:ring-amber-400/40"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
