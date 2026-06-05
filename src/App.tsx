import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-200">
      <div className="w-8 h-8 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
