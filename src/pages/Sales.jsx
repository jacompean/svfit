import React, { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Sales() {
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [payment, setPayment] = useState('cash')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/api/products').then(r=>setProducts(r.data.products||[])).catch(()=>{})
  }, [])

  const add = (p) => {
    const next = [...items]
    const idx = next.findIndex(x=>x.product_id===p.id)
    if (idx>=0) next[idx].qty += 1
    else next.push({ product_id: p.id, name: p.name, price_cents: p.price_cents, qty: 1 })
    setItems(next)
  }

  const total = items.reduce((s, it)=>s + it.price_cents*it.qty, 0)

  const submit = async () => {
    setMsg('')
    try {
      const payload = {
        payment_method: payment,
        items: items.map(i=>({ product_id: i.product_id, qty: i.qty }))
      }
      const r = await api.post('/api/sales', payload)
      setItems([])
      setMsg(`Venta registrada. Total: ${(r.data.sale.total_cents/100).toFixed(2)}`)
    } catch (e) {
      setMsg(apiErrorMessage(e))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Ventas</h1>
      <p className="text-sv-muted mt-1">Efectivo requiere caja abierta.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Productos</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {products.map(p => (
              <button key={p.id} className="sv-card p-3 text-left hover:bg-white/5" onClick={()=>add(p)}>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-sv-muted">Stock: {p.stock} • ${(p.price_cents/100).toFixed(2)}</div>
              </button>
            ))}
            {products.length===0 ? <div className="text-sm text-sv-muted">Sin productos.</div> : null}
          </div>
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Ticket</div>
          <div className="mt-3 space-y-2">
            {items.map(it => (
              <div key={it.product_id} className="flex justify-between border-b border-sv-border pb-2">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-xs text-sv-muted">{it.qty} x ${(it.price_cents/100).toFixed(2)}</div>
                </div>
                <div className="font-semibold">${((it.price_cents*it.qty)/100).toFixed(2)}</div>
              </div>
            ))}
            {items.length===0 ? <div className="text-sm text-sv-muted">Agrega productos del panel izquierdo.</div> : null}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sv-muted">Total</span>
            <span className="text-2xl font-black">${(total/100).toFixed(2)}</span>
          </div>

          <div className="mt-3">
            <label className="text-sm text-sv-muted">Método de pago</label>
            <select className="sv-input mt-1" value={payment} onChange={(e)=>setPayment(e.target.value)}>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>

          <button className="sv-btn-primary w-full mt-3" onClick={submit} disabled={items.length===0}>Cobrar</button>
          {msg ? <div className="mt-3 text-sm">{msg}</div> : null}
        </div>
      </div>
    </div>
  )
}
