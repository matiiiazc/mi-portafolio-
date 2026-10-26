export default function QueSoluciona() {
  return (
    <main className="min-h-full bg-hueso px-5 py-8 text-tinta sm:px-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-mocha">Lattecito · Sistema de gestión</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Qué soluciona</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-piedra">Centraliza la operación diaria de una cafetería: pedidos, caja, turnos, productos y stock en una sola herramienta.</p>
        <div className="mt-8 grid gap-4">
          {[
            ['El problema', 'Cuando los pedidos, cobros e inventario se anotan en lugares distintos, cuesta ver qué está pendiente y cómo cerró el día. La app ordena esos movimientos para que el equipo trabaje desde la misma información.'],
            ['Cómo funciona', 'El personal inicia un turno, crea comandas desde el catálogo, guarda pedidos para cobrarlos luego y registra movimientos de caja. El panel de administración permite revisar productos, stock, actividad y horas.'],
            ['Qué se puede recorrer aquí', 'Esta copia conserva la interfaz y las pantallas originales. Puedes navegar por el resumen, crear una comanda, guardarla, cobrarla, revisar caja e inventario y explorar las secciones administrativas. Los cambios se guardan solo en memoria durante esta visita.'],
            ['Construcción y alcance', 'El sistema original se construyó con React, Vite, Tailwind CSS y Zustand, con un backend Node.js/Hono y PostgreSQL en Neon. Esta publicación integra el frontend original en el portafolio y reemplaza la API por una simulación local. Se usan nombres, ventas y productos ficticios; no se conecta ni copia información de producción. Algunas operaciones de servidor, como impresión física y persistencia entre sesiones, no pueden ocurrir en una demo estática.'],
          ].map(([title, body]) => <article key={title} className="rounded-2xl border border-latte/70 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 leading-7 text-piedra">{body}</p></article>)}
        </div>
      </div>
    </main>
  )
}
