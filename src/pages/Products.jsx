import React, { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../lib/api'

export default function Products() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ name:'', sku:'', price_cents: 0, stock: 0 })

  const load = async () => {
    const r = await api.get('/api/products')
    setItems(r.data.products || [])
  }

  useEffect(() => {
    load().catch(e=>setErr(apiErrorMessage(e)))
  }, [])

  const create = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/api/products', {
        ...form,
        price_cents: Number(form.price_cents),
        stock: Number(form.stock),
      })
      setForm({ name:'', sku:'', price_cents: 0, stock: 0 })
      await load()
    } catch (e2) {
      setErr(apiErrorMessage(e2))
    }
  }

  const adjust = async (id, delta) => {
    const reason = prompt('Motivo del ajuste (ej. entrada, merma, corrección):', 'entrada')
    if (!reason) return
    try {
      await api.post(`/api/products/${id}/adjust`, { delta, reason })
      await load()
    } catch (e) {
      alert(apiErrorMessage(e))
    }
  }

  const deactivate = async (id) => {
    if (!confirm('¿Eliminar (desactivar) producto?')) return
    try {
      await api.delete(`/api/products/${id}`)
      await load()
    } catch (e) {
      alert(apiErrorMessage(e))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Inventario</h1>
      <p className="text-sv-muted mt-1">Admin/Staff/Coach pueden gestionar.</p>
      {err ? <div className="mt-4 text-sm text-red-300">{err}</div> : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sv-card p-4">
          <div className="font-semibold">Agregar producto</div>
          <form className="mt-3 space-y-3" onSubmit={create}>
            <div>
              <label className="text-sm text-sv-muted">Nombre</label>
              <input className="sv-input mt-1" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-sv-muted">SKU</label>
                <input className="sv-input mt-1" value={form.sku} onChange={(e)=>setForm({...form, sku:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-sv-muted">Precio (centavos)</label>
                <input className="sv-input mt-1" type="number" value={form.price_cents} onChange={(e)=>setForm({...form, price_cents:e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-sm text-sv-muted">Stock inicial</label>
              <input className="sv-input mt-1" type="number" value={form.stock} onChange={(e)=>setForm({...form, stock:e.target.value})} />
            </div>
            <button className="sv-btn-primary w-full">Crear</button>
          </form>
        </div>

        <div className="sv-card p-4">
          <div className="font-semibold">Productos</div>
          <div className="mt-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-sv-muted">
                <tr>
                  <th className="text-left py-2">Nombre</th>
                  <th className="text-left py-2">Stock</th>
                  <th className="text-left py-2">Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id} className="border-t border-sv-border">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.stock}</td>
                    <td className="py-2">{(p.price_cents/100).toFixed(2)}</td>
                    <td className="py-2 text-right space-x-2">
                      <button className="sv-btn-ghost text-xs" onClick={()=>adjust(p.id, 1)}>+1</button>
                      <button className="sv-btn-ghost text-xs" onClick={()=>adjust(p.id, -1)}>-1</button>
                      <button className="sv-btn-ghost text-xs" onClick={()=>deactivate(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {items.length===0 ? <tr><td colSpan={4} className="py-3 text-sv-muted">Sin productos.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
