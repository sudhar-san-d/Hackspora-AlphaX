import { ArrowDownUp, ChevronRight, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Complaint } from '../types'
import { EmptyState, PriorityBadge, StatusBadge } from './UI'

type SortKey = 'priority' | 'updated' | 'due'
const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 }

export function ComplaintTable({
  complaints,
  routePrefix,
  selectedId,
  onSelect,
  defaultSort = 'priority',
}: {
  complaints: Complaint[]
  routePrefix: string
  selectedId?: string
  onSelect?: (id: string) => void
  defaultSort?: SortKey
}) {
  const [sort, setSort] = useState<SortKey>(defaultSort)
  const navigate = useNavigate()

  const sorted = useMemo(
    () =>
      [...complaints].sort((a, b) =>
        sort === 'priority'
          ? priorityRank[a.priority] - priorityRank[b.priority] || new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
          : sort === 'updated'
          ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          : new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
      ),
    [complaints, sort]
  )

  if (!complaints.length) return <EmptyState title="No reports match" description="Adjust the filters to bring active infrastructure reports back into view." />

  const activate = (id: string) => (onSelect ? onSelect(id) : navigate(`${routePrefix}/${id}`))

  return (
    <div className="min-w-0 overflow-hidden border border-[#DCDAD7] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCDAD7] bg-[#F2F1F0]/60 px-5 py-3.5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6F72]">
          <span className="font-mono text-[#2B3033]">{complaints.length}</span> WORK ITEMS
        </p>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B6F72]">
          <ArrowDownUp size={14} strokeWidth={2} />
          Sort
          <span className="sr-only">complaints by</span>
          <select
            value={sort}
            onChange={event => setSort(event.target.value as SortKey)}
            className="border border-[#DCDAD7] bg-white px-2.5 py-1.5 text-xs font-bold text-[#2B3033] focus:border-[#15BCDF] focus:outline-none"
          >
            <option value="priority">Priority first</option>
            <option value="due">Due soonest</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead className="bg-[#F2F1F0]">
            <tr>
              {['Priority', 'Report', 'Location', 'Status', 'Due', ''].map(label => (
                <th key={label} scope="col" className="border-b border-[#DCDAD7] px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B6F72]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDAD7] bg-white">
            {sorted.map(item => (
              <tr
                key={item.id}
                tabIndex={0}
                onClick={() => activate(item.id)}
                onKeyDown={event => {
                  if (event.key === 'Enter') activate(item.id)
                }}
                className={`cursor-pointer transition-colors hover:bg-[#F2F1F0]/70 ${
                  selectedId === item.id ? 'border-l-4 border-l-[#15BCDF] bg-[#15BCDF]/10' : ''
                }`}
              >
                <td className="px-5 py-4">
                  <PriorityBadge priority={item.priority} />
                </td>
                <td className="max-w-[300px] px-5 py-4">
                  <p className="font-mono text-[10px] font-bold text-[#6B6F72]">{item.id}</p>
                  <p className="mt-1 truncate text-sm font-bold text-[#2B3033]">{item.title}</p>
                </td>
                <td className="max-w-[250px] px-5 py-4">
                  <span className="flex items-center gap-2 truncate text-xs text-[#6B6F72]">
                    <MapPin className="shrink-0 text-[#6B6F72]" size={14} strokeWidth={2} />
                    {item.location.address}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="font-mono whitespace-nowrap px-5 py-4 text-xs font-bold text-[#6B6F72]">
                  {new Date(item.dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-5 py-4 text-right">
                  <ChevronRight className="inline text-[#6B6F72]" size={16} strokeWidth={2} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#DCDAD7] md:hidden">
        {sorted.map(item => (
          <button
            key={item.id}
            onClick={() => activate(item.id)}
            className={`block w-full p-4 text-left ${selectedId === item.id ? 'bg-[#15BCDF]/10' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <PriorityBadge priority={item.priority} />
              <span className="font-mono text-[10px] font-bold text-[#6B6F72]">{item.id}</span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#2B3033]">{item.title}</p>
            <p className="mt-1.5 truncate text-xs text-[#6B6F72]">{item.location.address}</p>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge status={item.status} />
              <ChevronRight className="text-[#6B6F72]" size={16} strokeWidth={2} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
