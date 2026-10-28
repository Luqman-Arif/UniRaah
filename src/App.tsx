import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { RoleProvider } from '@/app/providers/RoleProvider'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { StudentProfileProvider } from '@/app/providers/StudentProfileProvider'
import { StudentDashboardProvider } from '@/app/providers/StudentDashboardProvider'
import { router } from '@/app/router'

export function App() {
  return (
    <QueryProvider>
      <RoleProvider>
        <AuthProvider>
          <StudentProfileProvider>
            <StudentDashboardProvider>
              <RouterProvider router={router} />
            </StudentDashboardProvider>
          </StudentProfileProvider>
        </AuthProvider>
      </RoleProvider>
    </QueryProvider>
  )
}

export default App
