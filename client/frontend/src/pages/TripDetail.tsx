import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTripDetail, type Seat, type TripDetail } from '../services/tripApi'

export default function TripDetail() {
  const { id } = useParams()
  const [data, setData] = useState<TripDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchTripDetail(Number(id))
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const toggle = (s: Seat) => {
    if (s.booked) return
    setSelected(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])
  }

  const canContinue = useMemo(() => selected.length > 0, [selected])

  if (loading) return <p style={{padding:16}}>Đang tải…</p>
  if (error)   return <p style={{padding:16, color:'red'}}>{error}</p>
  if (!data)   return null

  return (
    <div style={{maxWidth: 900, margin:'20px auto', padding:16}}>
      <h2>{data.fromName} → {data.toName}</h2>
      <div>Khởi hành: {new Date(data.departureTime).toLocaleString()}</div>
      <div>Đến nơi: {new Date(data.arrivalTime).toLocaleString()}</div>
      <div>Xe: {data.busName} ({data.plate})</div>

      <h3 style={{marginTop:20}}>Chọn ghế</h3>
      <div
        style={{
          display:'grid',
          gridTemplateColumns:'repeat(4, 80px)',
          gap:10,
          marginTop:10
        }}
      >
        {data.seats.map(s => {
          const isSel = selected.includes(s.id)
          const disabled = s.booked
          return (
            <button
              key={s.id}
              onClick={() => toggle(s)}
              disabled={disabled}
              style={{
                height:60, borderRadius:6, border:'1px solid #ccc',
                background: disabled ? '#ddd' : isSel ? '#9fd' : '#fff',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
              title={s.type}
            >
              {s.code}
            </button>
          )
        })}
      </div>

      <div style={{marginTop:16}}>
        <strong>Đã chọn:</strong> {selected.length ? selected.length : 'chưa có'}
      </div>

      <button
        style={{marginTop:12}}
        disabled={!canContinue}
        onClick={() => alert(`Đi tiếp thanh toán với seats=${selected.join(',')}`)}
      >
        Tiếp tục
      </button>
    </div>
  )
}
