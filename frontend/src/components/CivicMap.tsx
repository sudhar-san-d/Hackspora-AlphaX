import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import type { Complaint } from '../types'
import { PriorityBadge, StatusBadge } from './UI'

function MapFocus({ selected }: { selected?: Complaint }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.flyTo([selected.location.lat, selected.location.lng], Math.max(map.getZoom(), 15), { duration: .65 })
  }, [map, selected])
  return null
}

function markerIcon(complaint: Complaint, selected: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="priority-marker priority-${complaint.priority}${selected ? ' marker-selected' : ''}" aria-hidden="true"></div>`,
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -13],
  })
}

export function CivicMap({ complaints, selectedId, onSelect, routePrefix, className = 'h-[440px]' }: { complaints: Complaint[]; selectedId?: string; onSelect?: (id: string) => void; routePrefix?: string; className?: string }) {
  const navigate = useNavigate()
  const selected = complaints.find(item => item.id === selectedId)
  const center: [number, number] = selected ? [selected.location.lat, selected.location.lng] : complaints.length ? [complaints[0].location.lat, complaints[0].location.lng] : [40.7185, -74.006]
  return <div className={`overflow-hidden border border-civic-border ${className}`}>
    <MapContainer center={center} zoom={14} scrollWheelZoom className="h-full w-full" aria-label="Complaint locations map">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapFocus selected={selected} />
      {complaints.map(complaint => <Marker key={complaint.id} position={[complaint.location.lat, complaint.location.lng]} icon={markerIcon(complaint, complaint.id === selectedId)} eventHandlers={{ click: () => onSelect?.(complaint.id) }}>
        <Popup><div className="min-w-44"><div className="mb-2 flex items-center justify-between gap-2"><span className="data text-xs text-civic-muted">{complaint.id}</span><PriorityBadge priority={complaint.priority} compact /></div><p className="mb-2 text-sm font-semibold leading-5">{complaint.title}</p><p className="mb-3 text-xs text-civic-muted">{complaint.location.address}</p><div className="flex items-center justify-between gap-3"><StatusBadge status={complaint.status} />{routePrefix && <button className="text-xs font-semibold text-blue-300" onClick={() => navigate(`${routePrefix}/${complaint.id}`)}>Open</button>}</div></div></Popup>
      </Marker>)}
    </MapContainer>
  </div>
}
