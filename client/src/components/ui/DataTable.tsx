import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends { id: number | string }> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchKeys = [],
  pageSize = 10,
  emptyMessage = 'No records found.',
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = String((a as Record<string,unknown>)[sortKey] ?? '');
        const bv = String((b as Record<string,unknown>)[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Search bar */}
      {searchKeys.length > 0 && (
        <div className="px-6 py-4 border-b border-[rgba(219,159,117,0.12)]">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6F65]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search…"
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(18,35,36,0.6)] border-b border-[rgba(219,159,117,0.10)]">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider select-none ${col.width ?? ''} ${col.sortable ? 'cursor-pointer hover:text-sand' : ''}`}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-[#545748] text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : paged.map(row => (
              <tr
                key={row.id}
                className={`border-b border-[rgba(84,87,72,0.2)] transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[rgba(219,159,117,0.05)]' : 'hover:bg-[rgba(219,159,117,0.03)]'}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={String(col.key)} className="px-6 py-4 text-[#F5EFE6] text-sm">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string,unknown>)[String(col.key)] ?? '—')}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[rgba(219,159,117,0.10)] flex items-center justify-between">
          <span className="text-[#7A6F65] text-xs">
            {(page-1)*pageSize+1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="p-1.5 rounded-lg text-[#B0A090] hover:text-sand hover:bg-[rgba(219,159,117,0.08)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[#F5EFE6] text-xs font-semibold">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg text-[#B0A090] hover:text-sand hover:bg-[rgba(219,159,117,0.08)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
