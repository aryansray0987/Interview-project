import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/AuthProvider.jsx"
import { InterviewProvider } from "./features/interview/InterviewProvider.jsx"
import { ThemeProvider } from "./context/ThemeProvider.jsx"

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
