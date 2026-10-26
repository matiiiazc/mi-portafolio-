// Datos inventados en memoria. Ninguna llamada de esta demo llega a la API de producción.
const productos = [
  { id: 1, nombre: 'Latte', categoria_id: 1, categoria: 'Café', precio: 3200, descripcion: 'Espresso y leche', activo: true, controla_stock: false, stock_actual: 0, stock_minimo: 0, opciones: [] },
  { id: 2, nombre: 'Cappuccino', categoria_id: 1, categoria: 'Café', precio: 3400, descripcion: '', activo: true, controla_stock: false, stock_actual: 0, stock_minimo: 0, opciones: [] },
  { id: 3, nombre: 'Medialuna', categoria_id: 2, categoria: 'Pastelería', precio: 1500, descripcion: '', activo: true, controla_stock: true, stock_actual: 8, stock_minimo: 12, opciones: [] },
  { id: 4, nombre: 'Cookie', categoria_id: 2, categoria: 'Pastelería', precio: 1800, descripcion: '', activo: true, controla_stock: true, stock_actual: 24, stock_minimo: 8, opciones: [] },
  { id: 5, nombre: 'Cold brew', categoria_id: 3, categoria: 'Fríos', precio: 3600, descripcion: '', activo: true, controla_stock: false, stock_actual: 0, stock_minimo: 0, opciones: [] },
]
let orders = [
  { id: 1047, estado: 'cobrada', total: 4700, tipo: 'mostrador', items: [{ producto_id: 1, nombre: 'Latte', cantidad: 1, subtotal: 3200 }, { producto_id: 3, nombre: 'Medialuna', cantidad: 1, subtotal: 1500 }], created_at: new Date().toISOString(), atendio: 'Camila Demo', usuario: 'Camila Demo', metodo_pago: 'efectivo' },
  { id: 1048, estado: 'cobrada', total: 3400, tipo: 'mostrador', items: [{ producto_id: 2, nombre: 'Cappuccino', cantidad: 1, subtotal: 3400 }], created_at: new Date().toISOString(), atendio: 'Camila Demo', usuario: 'Camila Demo', metodo_pago: 'transferencia' },
  { id: 1049, estado: 'pendiente', total: 5000, tipo: 'mostrador', items: [{ producto_id: 1, nombre: 'Latte', cantidad: 1, subtotal: 3200 }, { producto_id: 4, nombre: 'Cookie', cantidad: 1, subtotal: 1800 }], created_at: new Date().toISOString(), atendio: 'Camila Demo', usuario: 'Camila Demo' },
]
let gastos = []
let turn = { id: 1, usuario: 'Camila Demo', usuario_id: 1, abierto_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), abierto: true, base_efectivo: 20000, vendido: 8100, comandas: 2, por_metodo: [{ metodo: 'efectivo', total: 4700, comandas: 1 }, { metodo: 'transferencia', total: 3400, comandas: 1 }] }
let mesas = [{ id: 1, numero: 1, estado: 'libre' }, { id: 2, numero: 2, estado: 'ocupada' }, { id: 3, numero: 3, estado: 'libre' }]
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
const originalFetch = window.fetch.bind(window)
window.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url, location.href)
  if (!url.hostname.includes('localhost') || !url.port || !['3000', '3001'].includes(url.port)) return originalFetch(input, init)
  const path = url.pathname.replace(/^\/api/, '')
  const method = init.method || 'GET'
  let body = {}; try { body = init.body ? JSON.parse(init.body) : {} } catch {}
  if (path === '/auth/me') return json({ usuario: { id: 1, nombre: 'Alex Demo', rol: 'admin' }, debeCambiarPassword: false })
  if (path.startsWith('/auth/')) return json({ token: 'demo-local', usuario: { id: 1, nombre: 'Alex Demo', rol: 'admin' }, debeCambiarPassword: false })
  if (path === '/turnos/actual') return json({ turno: turn })
  if (path === '/turnos/perfiles') return json([{ id: 1, nombre: 'Camila Demo' }, { id: 2, nombre: 'Alex Demo' }])
  if (path === '/turnos/abrir' && method === 'POST') { turn = { id: 1, usuario: 'Camila Demo', abierto_at: new Date().toISOString(), vendido: 0, comandas: 0, por_metodo: [], ...body, abierto: true }; return json({ turno }) }
  if (path === '/turnos/cerrar' && method === 'POST') { const closed = turn; turn = null; return json({ turno: closed }) }
  if (path.startsWith('/turnos/historial')) return json([{ id: 1, usuario: 'Camila Demo', inicio: new Date().toISOString(), fin: null, ventas: 186400 }])
  if (path === '/turnos/horas') return json({ empleados: [{ id: 1, nombre: 'Camila Demo', horas: 6.5 }, { id: 2, nombre: 'Alex Demo', horas: 4 }] })
  if (path === '/productos/categorias') return json([{ id: 1, nombre: 'Café' }, { id: 2, nombre: 'Pastelería' }, { id: 3, nombre: 'Fríos' }])
  if (path.startsWith('/productos')) {
    if (method === 'GET') return json(productos)
    if (method === 'POST' || method === 'PATCH') { const id = Number(path.split('/')[2]) || Math.max(...productos.map(p => p.id)) + 1; const p = { ...productos.find(x => x.id === id), ...body, id }; const i = productos.findIndex(x => x.id === id); i < 0 ? productos.push(p) : productos.splice(i, 1, p); return json(p) }
    return json({ ok: true })
  }
  if (path.startsWith('/comandas/')) {
    if (path === '/comandas/abiertas' && method === 'GET') return json(orders.filter(x => x.estado === 'pendiente'))
    if (path === '/comandas/abiertas' && method === 'POST') { const order = { id: Date.now().toString().slice(-4), estado: 'pendiente', total: (body.items || []).reduce((s, i) => s + (productos.find(p => p.id === i.producto_id)?.precio || 0) * i.cantidad, 0), items: (body.items || []).map(i => ({ ...i, nombre: productos.find(p => p.id === i.producto_id)?.nombre || 'Producto', precio_unitario: productos.find(p => p.id === i.producto_id)?.precio || 0, subtotal: (productos.find(p => p.id === i.producto_id)?.precio || 0) * i.cantidad })), tipo: body.tipo, created_at: new Date().toISOString(), atendio: 'Camila Demo' }; orders.push(order); return json(order) }
    const id = path.split('/')[2], order = orders.find(x => String(x.id) === id)
    if (path.endsWith('/cobrar') && order) { Object.assign(order, { estado: 'cobrada', ...body, cobrada_en: new Date().toISOString() }); return json(order) }
    if (path.endsWith('/anular') && order) { order.estado = 'anulada'; return json(order) }
    return json({ ok: true })
  }
  if (path === '/comandas') return json(orders)
  if (path.startsWith('/stock')) {
    if (path === '/stock/entrada' && method === 'POST') { const p = productos.find(x => x.id === Number(body.producto_id)); if (p) p.stock_actual = Math.max(0, p.stock_actual + Number(body.cantidad || 0)); return json({ producto: p?.nombre || 'Producto', delta: Number(body.cantidad || 0), stock_actual: p?.stock_actual || 0 }) }
    if (path.includes('movimientos')) return json([])
    return json(productos.filter(p => p.controla_stock).map(p => ({ ...p, estado: p.stock_actual <= p.stock_minimo ? 'bajo' : 'ok' })))
  }
  if (path.startsWith('/gastos/resumen')) { const totalGastos = gastos.reduce((n, g) => n + Number(g.monto), 0); const ingresos = orders.filter(x => x.estado === 'cobrada').reduce((n, x) => n + x.total, 0); const resultados = ingresos - totalGastos; const params = new URLSearchParams(url.search); return json({ desde: params.get('desde') || new Date().toISOString().slice(0,10), hasta: params.get('hasta') || new Date().toISOString().slice(0,10), totales: { ingresos, gastos: totalGastos, resultado: resultados, comandas: orders.filter(x=>x.estado==='cobrada').length, ticket_promedio: 4050, anuladas: orders.filter(x=>x.estado==='anulada').length, cantidad_gastos: gastos.length, margen_diario: resultados }, dias: [{ dia: params.get('hasta') || new Date().toISOString().slice(0,10), ingresos, gastos: totalGastos, resultado: resultados }], por_metodo: [{ metodo: 'efectivo', total: 4700 }, { metodo: 'transferencia', total: 3400 }], por_categoria: [] }) }
  if (path === '/gastos' && method === 'GET') return json(gastos)
  if (path === '/gastos' && method === 'POST') { const g = { id: Date.now(), ...body }; gastos.push(g); return json(g) }
  if (path.startsWith('/gastos/') && method === 'DELETE') { gastos = gastos.filter(g => String(g.id) !== path.split('/')[2]); return json({ ok: true }) }
  if (path === '/asistencia/resumen') return json({ empleados: [{ id: 1, nombre: 'Camila Demo', turnos: 12, horas: 68 }] })
  if (path.startsWith('/actividad')) return json([])
  if (path.startsWith('/mesas')) {
    if (method === 'GET') return json(mesas)
    if (method === 'POST') { const row = { id: Date.now(), ...body, estado: 'libre' }; mesas.push(row); return json(row) }
    return json({ ok: true })
  }
  return json([])
}




