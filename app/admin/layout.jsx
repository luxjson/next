import AdminLayout from '../../components/legacy-pages/Admin/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
