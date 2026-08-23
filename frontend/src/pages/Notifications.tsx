import { Bell, Check, CheckCheck, ChevronRight, Clock3 } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, SectionHeading } from '../components/UI'
import { useApp } from '../context/AppContext'

export default function Notifications() {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp()
  const navigate = useNavigate()
  const visible = useMemo(() => notifications.filter(item => currentUser?.role === 'admin' || item.userId === currentUser?.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [notifications, currentUser])
  const unread = visible.filter(item => !item.read).length
  const open = (id: string, complaintId?: string) => { markNotificationRead(id); if (complaintId) navigate(currentUser?.role === 'citizen' ? `/citizen/complaints/${complaintId}` : currentUser?.role === 'officer' ? `/officer/complaints/${complaintId}` : '/admin') }
  return <div className="space-y-7"><SectionHeading eyebrow="Service updates" title="Notifications" description={`${unread} unread update${unread === 1 ? '' : 's'} across your CivicTrack workspace.`} action={unread > 0 ? <Button variant="secondary" icon={CheckCheck} onClick={markAllNotificationsRead}>Mark all read</Button> : undefined}/>
    {visible.length ? <div className="border-y border-civic-border divide-y divide-civic-border">{visible.map(item => <button key={item.id} onClick={() => open(item.id, item.complaintId)} className={`grid w-full grid-cols-[34px_1fr_auto] gap-4 px-2 py-5 text-left transition-colors hover:bg-civic-secondary/60 sm:px-4 ${item.read ? '' : 'border-l-2 border-l-civic-accent bg-civic-secondary/35'}`}><span className={`grid h-8 w-8 place-items-center rounded-full border ${item.tone === 'success' ? 'border-civic-success/40 text-green-300' : item.tone === 'warning' ? 'border-civic-warning/40 text-amber-300' : 'border-civic-accent/40 text-blue-300'}`}>{item.read ? <Check size={14} strokeWidth={1.6}/> : <Bell size={14} strokeWidth={1.6}/>}</span><span><span className="block text-sm font-semibold text-civic-text">{item.title}</span><span className="mt-1 block text-xs leading-5 text-civic-muted">{item.message}</span><span className="mt-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[.1em] text-civic-muted"><Clock3 size={12} strokeWidth={1.6}/>{new Date(item.createdAt).toLocaleString()}</span></span><ChevronRight className="mt-2 text-civic-muted" size={16} strokeWidth={1.6}/></button>)}</div> : <EmptyState icon={Bell} title="No notifications" description="Status updates, crew activity, and verified outcomes will appear here."/>}
  </div>
}
