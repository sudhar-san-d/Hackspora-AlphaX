import { Bell, Check, CheckCheck, ChevronRight, Clock3 } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, SectionHeading } from '../components/UI'
import { useApp } from '../context/AppContext'

export default function Notifications() {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp()
  const navigate = useNavigate()

  const visible = useMemo(
    () =>
      notifications
        .filter(item => currentUser?.role === 'admin' || item.userId === currentUser?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications, currentUser]
  )

  const unread = visible.filter(item => !item.read).length

  const open = (id: string, complaintId?: string) => {
    markNotificationRead(id)
    if (complaintId) {
      navigate(
        currentUser?.role === 'citizen'
          ? `/citizen/complaints/${complaintId}`
          : currentUser?.role === 'officer'
          ? `/officer/complaints/${complaintId}`
          : '/admin'
      )
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Service Updates"
        title="Notifications"
        description={`${unread} unread update${unread === 1 ? '' : 's'} across your CivicTrack workspace.`}
        action={
          unread > 0 ? (
            <Button variant="secondary" icon={CheckCheck} onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {visible.length ? (
        <div className="divide-y divide-[#DCDAD7] border-y border-[#DCDAD7] bg-white shadow-sm">
          {visible.map(item => (
            <button
              key={item.id}
              onClick={() => open(item.id, item.complaintId)}
              className={`grid w-full grid-cols-[40px_1fr_auto] items-start gap-4 p-5 text-left transition-colors hover:bg-[#F2F1F0]/70 ${
                item.read ? 'bg-white' : 'border-l-4 border-l-[#15BCDF] bg-[#15BCDF]/5'
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border ${
                  item.tone === 'success'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : item.tone === 'warning'
                    ? 'border-amber-600 bg-amber-50 text-amber-800'
                    : 'border-[#0fa3c2] bg-[#15BCDF]/10 text-[#0fa3c2]'
                }`}
              >
                {item.read ? <Check size={16} strokeWidth={2.5} /> : <Bell size={16} strokeWidth={2.5} />}
              </span>
              <span>
                <span className="block text-sm font-bold uppercase tracking-wider text-[#2B3033]">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-[#6B6F72]">
                  {item.message}
                </span>
                <span className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6F72]">
                  <Clock3 size={13} strokeWidth={2} className="text-[#6B6F72]" />
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </span>
              <ChevronRight className="mt-2 text-[#6B6F72] transition-transform group-hover:translate-x-1" size={18} strokeWidth={2} />
            </button>
          ))}
        </div>
      ) : (
        <EmptyState icon={Bell} title="No notifications" description="Status updates, crew activity, and verified outcomes will appear here." />
      )}
    </div>
  )
}
