import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import {
  Users,
  Wallet,
  CalendarOff,
  FileText,
  ClipboardCheck,
  UserCheck,
  UserX,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
  Info,
} from 'lucide-react';
import Login from './components/login';
import ChangePasswordModal from './components/ChangePasswordModal';
import { API_URL } from './utils/api';
import {
  guardarSesion,
  setToken,
  actualizarUsuario,
  leerUsuario,
  limpiarSesion,
} from './utils/session';
import type { UsuarioLogueado } from './utils/session';

const ContractorsPage = lazy(() => import('./components/ContractorsPage'));
const PaymentsPage = lazy(() => import('./components/PaymentsPage'));
const AbsencePage = lazy(() => import('./components/AbsencePage'));
const CandidatesPage = lazy(() => import('./components/CandidatesPage'));
const TestsPage = lazy(() => import('./components/TestsPage'));
const HiredPage = lazy(() => import('./components/HiredPage'));
const OffboardedPage = lazy(() => import('./components/OffboardedPage'));

type Vista = 'contractors' | 'payments' | 'absences' | 'candidates' | 'tests' | 'hired' | 'offboarded' | 'about';

function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('tema') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('tema', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

function PortfolioAbout() {
  return <article className="mx-auto max-w-4xl space-y-5 p-5 sm:p-8">
    <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-teal-600 dark:text-teal-400">People operations · HR platform</p><h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">Qué soluciona</h1><p className="mt-3 max-w-3xl text-base leading-7 text-zinc-500 dark:text-zinc-400">Organiza la gestión de contractors y los procesos de personas en un espacio común, con información consultable y etapas claras.</p></div>
    {[
      ['Contexto', 'Se desarrolló para una empresa de Estados Unidos. El proyecto quedó funcional, aunque no fue adoptado por la empresa. Esta versión conserva sus módulos originales y sustituye la información de personas por registros ficticios.'],
      ['El problema', 'La contratación internacional reparte datos entre hojas, correos, facturas y documentos. Pagos, ausencias y reclutamiento tienen ciclos diferentes, pero necesitan relacionarse con un mismo registro y poder seguirse con claridad.'],
      ['Cómo se usa', 'El equipo navega por Contractors, Payments, Absences, Candidates, Tests, Hired y Offboarded. Las tablas permiten buscar, filtrar, crear y editar registros; el flujo de candidatos permite documentar etapas y resultados.'],
      ['Construcción y alcance', 'La aplicación original está hecha con React, TypeScript, Tailwind CSS y Lucide en el frontend, más Express, Prisma y PostgreSQL en el backend. Aquí se usa el frontend original integrado en el portafolio y una API local en memoria. Los cambios son temporales. Se omitieron conexiones a servidor y archivos reales para proteger datos personales, bancarios y documentos.'],
    ].map(([title, body]) => <section key={title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 className="font-semibold text-zinc-900 dark:text-white">{title}</h2><p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">{body}</p></section>)}
  </article>;
}

function App() {
  const [usuario, setUsuario] = useState<UsuarioLogueado | null>(() => leerUsuario());
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState<Vista>('contractors');
  const { dark, toggle: toggleDark } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    // La sesión real está en la cookie HttpOnly; al recargar la página la
    // validamos contra el backend (que además nos re-emite el token en
    // memoria para poder firmar URLs de archivos).
    async function validarSesion() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          setUsuario(data.user);
        } else {
          limpiarSesion();
          setUsuario(null);
        }
      } catch {
        limpiarSesion();
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    }

    validarSesion();
  }, []);

  const handleLoginSuccess = (data: { token: string; user: UsuarioLogueado }) => {
    guardarSesion(data.token, data.user);
    setToken(data.token);
    setUsuario(data.user);
    if (data.user.mustChangePassword) {
      setShowChangePassword(true);
    }
  };

  const handleChangePasswordSuccess = () => {
    if (usuario) {
      const updated = { ...usuario, mustChangePassword: false };
      actualizarUsuario(updated);
      setUsuario(updated);
    }
    setShowChangePassword(false);
  };

  const handleLogout = async () => {
    limpiarSesion();
    setUsuario(null);
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // aunque falle el logout en el server, ya borramos la sesión local
    }
  };

  const navegar = useCallback((v: Vista) => {
    setVista(v);
    setSidebarOpen(false);
  }, []);

  if (cargando) return null;

  if (!usuario) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const iniciales = usuario.nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const itemsNav: { key: Vista; label: string; icon: typeof Users }[] = [
    { key: 'contractors', label: 'Contractors', icon: Users },
    { key: 'payments', label: 'Payments', icon: Wallet },
    { key: 'absences', label: 'Absences', icon: CalendarOff },
    { key: 'candidates', label: 'Candidates', icon: FileText },
    { key: 'tests', label: 'Tests', icon: ClipboardCheck },
    { key: 'hired', label: 'Hired', icon: UserCheck },
    { key: 'offboarded', label: 'Offboarded', icon: UserX },
    { key: 'about', label: 'Qué soluciona', icon: Info },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-5 pb-6">
        <img
          src="/demos/rrhh/logo_full_watar-ai.png"
          alt="Watar-ai"
          className="h-10 w-auto object-contain"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={toggleDark}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200/60 hover:text-zinc-700 md:hidden dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {itemsNav.map((item) => {
          const Icon = item.icon;
          const activo = vista === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navegar(item.key)}
              className={`flex items-center gap-2.5 rounded-full px-3.5 py-2 text-left text-sm font-medium transition-all duration-150 ${
                activo
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-teal-500 dark:text-zinc-950'
                  : 'text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-800 hover:scale-[1.02] dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100'
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        <div className="mb-2 flex items-center gap-2 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-teal-500 dark:text-zinc-950">
            {iniciales}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{usuario.nombre}</p>
            <p className="text-xs capitalize text-zinc-400 dark:text-zinc-500">{usuario.rol}</p>
          </div>
        </div>
          <button
            onClick={() => { setShowChangePassword(true); setSidebarOpen(false); }}
            className="flex w-full items-center gap-1.5 rounded-lg border border-stone-200 bg-white py-1.5 text-xs font-medium text-zinc-500 transition-all duration-150 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
          >
            <Lock size={13} />
            Change password
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white py-1.5 text-xs font-medium text-zinc-500 transition-all duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:scale-[1.01] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          >
          <LogOut size={13} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 p-2 sm:p-3 dark:bg-zinc-950">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-stone-50 md:hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden flex-col rounded-2xl border border-stone-200 bg-stone-50 py-5 md:flex md:w-60 dark:border-zinc-800 dark:bg-zinc-900">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-stone-50 py-5 transition-transform duration-200 ease-in-out md:hidden dark:border-zinc-800 dark:bg-zinc-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Contenido */}
      <main className="min-w-0 flex-1 overflow-y-auto scroll-smooth pt-12 pl-2 sm:pl-3 md:pt-0 md:pl-3">
        <div key={vista} className="page-transition">
          <Suspense fallback={<div className="p-6 text-sm text-zinc-400 dark:text-zinc-500">Loading...</div>}>
            {vista === 'contractors' && <ContractorsPage />}
            {vista === 'payments' && <PaymentsPage />}
            {vista === 'absences' && <AbsencePage />}
            {vista === 'candidates' && <CandidatesPage />}
            {vista === 'tests' && <TestsPage />}
            {vista === 'hired' && <HiredPage />}
            {vista === 'offboarded' && <OffboardedPage />}
            {vista === 'about' && <PortfolioAbout />}
          </Suspense>
        </div>
      </main>

      {(showChangePassword || usuario.mustChangePassword) && (
        <ChangePasswordModal
          obligatory={!!usuario.mustChangePassword}
          onClose={() => setShowChangePassword(false)}
          onSuccess={handleChangePasswordSuccess}
        />
      )}
    </div>
  );
}

export default App;


