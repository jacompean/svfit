import React from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { api, clearToken, getToken, setToken } from './api.js'

function useAsync(fn, deps=[]){
  const [state, setState] = React.useState({ loading:true, data:null, error:null })
  React.useEffect(() => {
    let mounted = true
    setState({ loading:true, data:null, error:null })
    fn().then(data => mounted && setState({ loading:false, data, error:null }))
      .catch(err => mounted && setState({ loading:false, data:null, error: err?.message || String(err) }))
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

function RequireAuth({ children }){
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function TopBar({ tenant, user }){
  const nav = useNavigate()
  return (
    <div className="header" style={{ marginBottom: 16 }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: 20 }}>{tenant?.tenant?.name || 'SVFIT'}</div>
        <div style={{ opacity: .75, fontSize: 12 }}>
          {user?.user?.id_code ? `${user.user.id_code} · ${user.user.role}` : 'Sin sesión'}
        </div>
      </div>
      <button className="btn secondary" onClick={() => { clearToken(); nav('/login'); }}>Salir</button>
    </div>
  )
}

function Layout({ tenant, user }){
  const role = user?.user?.role
  const canOps = ['admin_tenant','staff','coach','admin'].includes(role)
  return (
    <div className="container" style={{ ['--accent']: tenant?.tenant?.accent_color || '#39ff14' }}>
      <TopBar tenant={tenant} user={user} />
      <div className="nav">
        <NavLink to="/app">Dashboard</NavLink>
        {canOps && <NavLink to="/app/members">Miembros</NavLink>}
        {canOps && <NavLink to="/app/inventory">Inventario</NavLink>}
        {canOps && <NavLink to="/app/pos">Ventas</NavLink>}
        {canOps && <NavLink to="/app/cash">Caja</NavLink>}
        {canOps && <NavLink to="/app/security">Contraseñas</NavLink>}
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/cash" element={<Cash />} />
        <Route path="/security" element={<Security />} />
      </Routes>
    </div>
  )
}

function Login(){
  const nav = useNavigate()
  const [identifier, setIdentifier] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [showForgot, setShowForgot] = React.useState(false)
  const [forgotId, setForgotId] = React.useState('')
  const [forgotMsg, setForgotMsg] = React.useState('')
  const [forgotErr, setForgotErr] = React.useState('')

  const tenant = useAsync(() => api.tenant(), [])

  return (
    <div className="container" style={{ maxWidth: 520, ['--accent']: tenant.data?.tenant?.accent_color || '#39ff14' }}>
      <div className="card">
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>{tenant.data?.tenant?.name || 'SVFIT'} · Portal</div>
        <div style={{ opacity: .75, marginBottom: 16 }}>Inicia sesión con tu ID (ej. SV0001) y contraseña.</div>
        {tenant.error && <div className="badge" style={{ marginBottom: 10, borderColor:'#ef4444' }}>{tenant.error}</div>}
        {error && <div className="badge" style={{ marginBottom: 10, borderColor:'#ef4444' }}>{error}</div>}

        <div style={{ marginBottom: 12 }}>
          <div className="label">ID</div>
          <input className="input" value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="SV0001 / admin" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="label">Contraseña</div>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" />
        </div>

        <button className="btn" onClick={async () => {
          setError('')
          try{
            const r = await api.login(identifier.trim(), password)
            setToken(r.token)
            nav('/app')
          }catch(e){
            setError(e.message || 'Error')
          }
        }}>Entrar</button>

        <button className="btn secondary" style={{ marginTop: 10 }} onClick={() => { 
          setForgotErr(''); setForgotMsg(''); setForgotId(identifier.trim()); setShowForgot(true); 
        }}>
          ¿Olvidaste tu contraseña?
        </button>

        {showForgot && (
          <div className="card" style={{ marginTop: 14, borderColor: 'var(--accent)' }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Recuperar contraseña</div>
            <div style={{ opacity: .75, fontSize: 13, marginBottom: 10 }}>
              Se creará una solicitud para que el staff la atienda. Por seguridad, el sistema no muestra contraseñas antiguas.
            </div>

            {forgotErr && <div className="badge" style={{ marginBottom: 10, borderColor:'#ef4444' }}>{forgotErr}</div>}
            {forgotMsg && <div className="badge" style={{ marginBottom: 10 }}>{forgotMsg}</div>}

            <div className="label">ID</div>
            <input className="input" value={forgotId} onChange={e=>setForgotId(e.target.value)} placeholder="SV0001" />

            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn" onClick={async () => {
                setForgotErr(''); setForgotMsg('');
                try {
                  const r = await api.forgot(forgotId.trim());
                  setForgotMsg(r.message || "Solicitud creada. Acude a recepción para restablecer tu contraseña.");
                } catch (e) {
                  setForgotErr(e.message || "Error");
                }
              }}>Enviar solicitud</button>

              <button className="btn secondary" onClick={() => setShowForgot(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Dashboard(){
  const me = useAsync(() => api.me(), [])
  const plans = useAsync(() => api.plans(), [])
  return (
    <div className="card">
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Dashboard</div>
      {me.loading ? <div>cargando…</div> : me.error ? <div className="badge" style={{ borderColor:'#ef4444' }}>{me.error}</div> :
        <div className="row">
          <div className="badge">Rol: {me.data.user.role}</div>
          <div className="badge">ID: {me.data.user.id_code}</div>
          <div className="badge">Tenant: {me.data.user.tenant_id ?? 'global'}</div>
        </div>
      }
      <div style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Planes</div>
        {plans.loading ? <div>cargando…</div> : plans.error ? <div className="badge" style={{ borderColor:'#ef4444' }}>{plans.error}</div> :
          <div className="row">
            {plans.data.plans.map(p => <div key={p.id} className="badge">{p.code}: {p.name}</div>)}
          </div>
        }
      </div>
    </div>
  )
}

function Members(){
  const [q, setQ] = React.useState('')
  const [refresh, setRefresh] = React.useState(0)
  const [err, setErr] = React.useState('')
  const members = useAsync(() => api.members(q), [q, refresh])
  const plans = useAsync(() => api.plans(), [])
  const [form, setForm] = React.useState({ first_name:'', last_name:'', phone:'', email:'', notes:'', plan_code:'STD' })
  const [activate, setActivate] = React.useState({ member_id:'', password:'', duration_days:30, plan_code:'STD' })

  return (
    <div className="row">
      <div className="card" style={{ flex:2, minWidth:320 }}>
        <div className="header">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Miembros</div>
          <div style={{ width: 280 }}>
            <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar…" />
          </div>
        </div>
        {err && <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{err}</div>}
        {members.loading ? <div style={{ marginTop:10 }}>cargando…</div> : members.error ? <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{members.error}</div> :
          <table className="table" style={{ marginTop:10 }}>
            <thead><tr><th>#</th><th>Nombre</th><th>Plan</th><th>Acceso</th></tr></thead>
            <tbody>
              {members.data.members.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.first_name} {m.last_name}</td>
                  <td>{m.plan_code || '-'}</td>
                  <td>{m.access_active ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      <div className="card" style={{ flex:1, minWidth:320 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Pre-registro</div>
        <div className="label">Nombre</div>
        <input className="input" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Apellido</div>
        <input className="input" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Teléfono</div>
        <input className="input" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Plan</div>
        <select className="input" value={form.plan_code} onChange={e=>setForm({...form, plan_code:e.target.value})}>
          {(plans.data?.plans || [{code:'STD',name:'STD'}]).map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}
        </select>
        <button className="btn" style={{ marginTop:12 }} onClick={async ()=>{
          setErr('')
          try{
            await api.preregister(form)
            setForm({ first_name:'', last_name:'', phone:'', email:'', notes:'', plan_code:'STD' })
            setRefresh(x=>x+1)
          }catch(e){ setErr(e.message || 'Error') }
        }}>Crear pre-registro</button>

        <hr style={{ borderColor:'#1f2937', margin:'16px 0' }} />

        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Activar acceso</div>
        <div className="label">ID interno del miembro</div>
        <input className="input" value={activate.member_id} onChange={e=>setActivate({...activate, member_id:e.target.value})} placeholder="Ej. 12" />
        <div className="label" style={{ marginTop:10 }}>Contraseña (mín 6)</div>
        <input className="input" type="password" value={activate.password} onChange={e=>setActivate({...activate, password:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Duración días</div>
        <input className="input" value={activate.duration_days} onChange={e=>setActivate({...activate, duration_days:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Plan</div>
        <select className="input" value={activate.plan_code} onChange={e=>setActivate({...activate, plan_code:e.target.value})}>
          {(plans.data?.plans || [{code:'STD',name:'STD'}]).map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}
        </select>
        <button className="btn" style={{ marginTop:12 }} onClick={async ()=>{
          setErr('')
          try{
            const mid = Number(activate.member_id)
            const r = await api.activate(mid, { password: activate.password, duration_days: Number(activate.duration_days||30), plan_code: activate.plan_code })
            alert(`Acceso activado. Nuevo ID: ${r.user.id_code}`)
            setActivate({ member_id:'', password:'', duration_days:30, plan_code:'STD' })
            setRefresh(x=>x+1)
          }catch(e){ setErr(e.message || 'Error') }
        }}>Activar</button>
      </div>
    </div>
  )
}

function Inventory(){
  const [refresh, setRefresh] = React.useState(0)
  const [err, setErr] = React.useState('')
  const data = useAsync(() => api.products(), [refresh])
  const [form, setForm] = React.useState({ sku:'', name:'', price_mxn:20, stock:10 })

  return (
    <div className="row">
      <div className="card" style={{ flex:2, minWidth:320 }}>
        <div className="header">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Inventario</div>
          <button className="btn secondary" onClick={()=>setRefresh(x=>x+1)}>Refrescar</button>
        </div>
        {err && <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{err}</div>}
        {data.loading ? <div style={{ marginTop:10 }}>cargando…</div> : data.error ? <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{data.error}</div> :
          <table className="table" style={{ marginTop:10 }}>
            <thead><tr><th>Producto</th><th>Precio</th><th>Stock</th></tr></thead>
            <tbody>
              {data.data.products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${Number(p.price_mxn).toFixed(2)}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      <div className="card" style={{ flex:1, minWidth:320 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Agregar producto</div>
        <div className="label">Nombre</div>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Precio</div>
        <input className="input" value={form.price_mxn} onChange={e=>setForm({...form, price_mxn:e.target.value})} />
        <div className="label" style={{ marginTop:10 }}>Stock</div>
        <input className="input" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} />
        <button className="btn" style={{ marginTop:12 }} onClick={async ()=>{
          setErr('')
          try{
            await api.addProduct({ name: form.name, price_mxn:Number(form.price_mxn), stock:Number(form.stock) })
            setForm({ sku:'', name:'', price_mxn:20, stock:10 })
            setRefresh(x=>x+1)
          }catch(e){ setErr(e.message || 'Error') }
        }}>Guardar</button>
      </div>
    </div>
  )
}

function Cash(){
  const [err, setErr] = React.useState('')
  const [refresh, setRefresh] = React.useState(0)
  const current = useAsync(() => api.cashCurrent(), [refresh])
  const [opening, setOpening] = React.useState(500)
  const [closing, setClosing] = React.useState(0)

  return (
    <div className="card">
      <div className="header">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Caja</div>
        <button className="btn secondary" onClick={()=>setRefresh(x=>x+1)}>Refrescar</button>
      </div>
      {err && <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{err}</div>}
      {current.loading ? <div style={{ marginTop:10 }}>cargando…</div> : current.error ? <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{current.error}</div> :
        <div style={{ marginTop:10 }}>
          {current.data.cash ? (
            <div className="row">
              <div className="badge">Caja abierta #{current.data.cash.id}</div>
              <div className="badge">Apertura ${Number(current.data.cash.opening_cash).toFixed(2)}</div>
            </div>
          ) : <div className="badge">No hay caja abierta</div>}
        </div>
      }

      {!current.data?.cash && (
        <div style={{ marginTop:14, maxWidth:320 }}>
          <div className="label">Monto inicial</div>
          <input className="input" value={opening} onChange={e=>setOpening(e.target.value)} />
          <button className="btn" style={{ marginTop:10 }} onClick={async ()=>{
            setErr('')
            try{ await api.cashOpen(Number(opening)); setRefresh(x=>x+1) }
            catch(e){ setErr(e.message || 'Error') }
          }}>Abrir caja</button>
        </div>
      )}

      {current.data?.cash && (
        <div style={{ marginTop:14, maxWidth:320 }}>
          <div className="label">Monto final</div>
          <input className="input" value={closing} onChange={e=>setClosing(e.target.value)} />
          <button className="btn danger" style={{ marginTop:10 }} onClick={async ()=>{
            setErr('')
            try{ await api.cashClose(Number(closing)); setRefresh(x=>x+1) }
            catch(e){ setErr(e.message || 'Error') }
          }}>Cerrar caja</button>
        </div>
      )}
    </div>
  )
}

function POS(){
  const [err, setErr] = React.useState('')
  const [refresh, setRefresh] = React.useState(0)
  const products = useAsync(() => api.products(), [refresh])
  const cash = useAsync(() => api.cashCurrent(), [refresh])
  const sales = useAsync(() => api.salesToday(), [refresh])
  const [cart, setCart] = React.useState([])
  const [payment_method, setPayment] = React.useState('cash')

  const total = cart.reduce((s, it) => s + (it.qty * it.price_mxn), 0)

  const addToCart = (p) => {
    setCart(prev => {
      const idx = prev.findIndex(x => x.product_id === p.id)
      if (idx >= 0){
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [...prev, { product_id:p.id, name:p.name, qty:1, price_mxn:Number(p.price_mxn) }]
    })
  }

  return (
    <div className="row">
      <div className="card" style={{ flex:2, minWidth:320 }}>
        <div className="header">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Ventas</div>
          <button className="btn secondary" onClick={()=>setRefresh(x=>x+1)}>Refrescar</button>
        </div>
        {cash.data?.cash ? <div className="badge" style={{ marginTop:10 }}>Caja abierta ✅</div> :
          <div className="badge" style={{ marginTop:10, borderColor:'#ef4444' }}>Abre caja antes de vender</div>}
        {products.loading ? <div style={{ marginTop:10 }}>cargando…</div> : products.error ? <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{products.error}</div> :
          <div style={{ marginTop:10 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Productos</div>
            <div className="row">
              {products.data.products.filter(p=>p.is_active).map(p => (
                <button key={p.id} className="btn secondary" onClick={()=>addToCart(p)}>
                  {p.name}<br /><span style={{ opacity:.75 }}>${Number(p.price_mxn).toFixed(2)} · {p.stock} stk</span>
                </button>
              ))}
            </div>
          </div>
        }
      </div>

      <div className="card" style={{ flex:1, minWidth:320 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Carrito</div>
        {err && <div className="badge" style={{ borderColor:'#ef4444', marginBottom:10 }}>{err}</div>}
        {cart.length === 0 ? <div className="badge">Vacío</div> :
          <table className="table">
            <thead><tr><th>Item</th><th>Cant</th><th>$</th></tr></thead>
            <tbody>
              {cart.map(it => (
                <tr key={it.product_id}>
                  <td>{it.name}</td><td>{it.qty}</td><td>${(it.qty*it.price_mxn).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }

        <div style={{ marginTop:10 }}>
          <div className="label">Pago</div>
          <select className="input" value={payment_method} onChange={e=>setPayment(e.target.value)}>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div className="row" style={{ marginTop:10, justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Total ${total.toFixed(2)}</div>
          <button className="btn" disabled={!cash.data?.cash || cart.length===0} onClick={async ()=>{
            setErr('')
            try{
              await api.createSale({ payment_method, items: cart.map(it => ({ product_id: it.product_id, qty: it.qty })) })
              setCart([])
              setRefresh(x=>x+1)
            }catch(e){ setErr(e.message || 'Error') }
          }}>Cobrar</button>
        </div>

        <hr style={{ borderColor:'#1f2937', margin:'16px 0' }} />
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Ventas de hoy</div>
        {sales.loading ? <div>cargando…</div> : sales.error ? <div className="badge" style={{ borderColor:'#ef4444' }}>{sales.error}</div> :
          <div style={{ maxHeight:240, overflow:'auto' }}>
            {sales.data.sales.map(s => (
              <div key={s.id} className="badge" style={{ display:'block', marginBottom:8 }}>
                #{s.id} · ${Number(s.total).toFixed(2)} · {s.payment_method}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}

function Security(){
  const [idCode, setIdCode] = React.useState('')
  const [newPass, setNewPass] = React.useState('')
  const [msg, setMsg] = React.useState('')
  const [err, setErr] = React.useState('')
  const [refresh, setRefresh] = React.useState(0)
  const requests = useAsync(() => api.resetRequests(), [refresh])

  return (
    <div className="row">
      <div className="card" style={{ flex:1, minWidth:320 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Reset de contraseña</div>
        <div style={{ opacity:.75, fontSize:13, marginBottom: 10 }}>
          Para staff/coach/admin. Ingresa el ID y genera una contraseña temporal (o define una nueva).
        </div>
        {err && <div className="badge" style={{ borderColor:'#ef4444', marginBottom:10 }}>{err}</div>}
        {msg && <div className="badge" style={{ marginBottom:10 }}>{msg}</div>}

        <div className="label">ID (ej. SV0007)</div>
        <input className="input" value={idCode} onChange={e=>setIdCode(e.target.value)} placeholder="SV0007" />

        <div className="label" style={{ marginTop:10 }}>Nueva contraseña (opcional)</div>
        <input className="input" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="dejar en blanco para generar temporal" />

        <button className="btn" style={{ marginTop:12 }} onClick={async ()=>{
          setErr(''); setMsg('');
          try {
            const r = await api.resetPassword(idCode.trim(), newPass.trim());
            setMsg(`Contraseña lista para ${r.id_code}. Temporal: ${r.tempPassword}`)
            setNewPass('');
            setRefresh(x=>x+1);
          } catch (e) {
            setErr(e.message || 'Error');
          }
        }}>Resetear</button>
      </div>

      <div className="card" style={{ flex:2, minWidth:320 }}>
        <div className="header">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Solicitudes de recuperación</div>
          <button className="btn secondary" onClick={() => setRefresh(x=>x+1)}>Refrescar</button>
        </div>

        {requests.loading ? <div style={{ marginTop:10 }}>cargando…</div> : requests.error ? (
          <div className="badge" style={{ borderColor:'#ef4444', marginTop:10 }}>{requests.error}</div>
        ) : (
          <table className="table" style={{ marginTop:10 }}>
            <thead><tr><th>#</th><th>ID</th><th>Estatus</th><th>Fecha</th></tr></thead>
            <tbody>
              {(requests.data.requests || []).map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.id_code}</td>
                  <td>{r.status}</td>
                  <td>{String(r.requested_at || '').slice(0,19).replace('T',' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/app/*" element={<RequireAuth><Authed /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}

function Authed(){
  const tenant = useAsync(() => api.tenant(), [])
  const user = useAsync(() => api.me(), [])
  if (tenant.loading || user.loading) return <div className="container"><div className="card">cargando…</div></div>
  if (tenant.error) return <div className="container"><div className="card">Error tenant: {tenant.error}</div></div>
  if (user.error) return <div className="container"><div className="card">Error sesión: {user.error}</div></div>
  return <Layout tenant={tenant.data} user={user.data} />
}
