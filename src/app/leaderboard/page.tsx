"use client"

import { useMemo, useState } from 'react'
import { useLeaderboard } from '@/hooks/use-leaderboard'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import type { LeaderboardRow } from '@/lib/api/api.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowUpDown, Eye, Medal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/layout/site-header'
import Link from 'next/link'

export default function LeaderboardPage() {
  const { data, isLoading, error } = useLeaderboard()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'count', desc: true }])

  const columns = useMemo<ColumnDef<LeaderboardRow>[]>(() => [
    {
      accessorKey: 'rank',
      header: '#',
      cell: ({ row }) => {
        const rank = row.original.rank
        const medalClass = rank === 1
          ? 'text-amber-500 dark:text-amber-400'
          : rank === 2
            ? 'text-slate-400 dark:text-slate-300'
            : rank === 3
              ? 'text-orange-700 dark:text-orange-500'
              : ''
        return (
          <span className="flex items-center font-medium tabular-nums">
            {rank <= 3 && (
              <Medal
                className={`h-4 w-4 mr-1 ${medalClass}`}
                aria-label={rank === 1 ? 'Gold medal' : rank === 2 ? 'Silver medal' : 'Bronze medal'}
              />
            )}
            {rank}
          </span>
        )
      },
      size: 70,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-2">
          User
          <ArrowUpDown className="h-4 w-4 ml-1 text-amber-600 dark:text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      ),
      cell: ({ row }) => {
        const r = row.original as { name: string; avatar: string | null }
        // const initials = r.name.split(/\s+/).slice(0,2).map(s => s[0]).join('').toUpperCase()
        return (
          <div className="flex items-center gap-3">
            {/* <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
              {initials}
            </div> */}
            <span className="font-medium">{r.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'count',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-2 whitespace-nowrap"
        >
          <span className="hidden xs:inline">Palindromes</span>
          <span className="inline xs:hidden">Pals</span>
          <ArrowUpDown className="h-4 w-4 ml-1 text-amber-600 dark:text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-semibold w-full block">
          {row.original.count}
        </span>
      ),
      size: 110,
    }
    ,
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const name = encodeURIComponent(row.original.name)
        return (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1"
          >
            <Link href={`/?user=${name}`} prefetch aria-label={`See palindromes by ${row.original.name}`}>
              <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">See palindromes</span>
            </Link>
          </Button>
        )
      },
      size: 56
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
  <div className="min-h-screen text-foreground">
      <SiteHeader pageTitle="Leaderboard" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Leaderboard</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-destructive">Error loading leaderboard</p>}
        {!isLoading && !error && (
          <div className="rounded-lg border border-amber-500/70 dark:border-amber-400/60 shadow-sm max-w-3xl mx-auto bg-background">
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
                      <TableCell className='px-2' key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
