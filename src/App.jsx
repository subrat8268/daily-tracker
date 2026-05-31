import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

// Code-split each page — Today loads immediately, others on first visit
const Today        = lazy(() => import('./pages/Today'));
const NamasteDev   = lazy(() => import('./pages/NamasteDev'));
const WeekPlan     = lazy(() => import('./pages/WeekPlan'));
const Routine      = lazy(() => import('./pages/Routine'));
const MachineCoding = lazy(() => import('./pages/MachineCoding'));
const QABank       = lazy(() => import('./pages/QABank'));
const DailyLog     = lazy(() => import('./pages/DailyLog'));
const LinkedIn     = lazy(() => import('./pages/LinkedIn'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/"        element={<Suspense fallback={<PageLoader />}><Today /></Suspense>} />
        <Route path="/namaste" element={<Suspense fallback={<PageLoader />}><NamasteDev /></Suspense>} />
        <Route path="/weeks"   element={<Suspense fallback={<PageLoader />}><WeekPlan /></Suspense>} />
        <Route path="/routine" element={<Suspense fallback={<PageLoader />}><Routine /></Suspense>} />
        <Route path="/machine" element={<Suspense fallback={<PageLoader />}><MachineCoding /></Suspense>} />
        <Route path="/qa"      element={<Suspense fallback={<PageLoader />}><QABank /></Suspense>} />
        <Route path="/log"     element={<Suspense fallback={<PageLoader />}><DailyLog /></Suspense>} />
        <Route path="/linkedin" element={<Suspense fallback={<PageLoader />}><LinkedIn /></Suspense>} />
        {/* /more route handled by MoreSheet, but keep a fallback */}
        <Route path="/more"    element={<Suspense fallback={<PageLoader />}><Today /></Suspense>} />
      </Route>
    </Routes>
  );
}
