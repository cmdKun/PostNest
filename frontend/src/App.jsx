import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"


import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Notification from './components/pages/Notification';
import { Toaster } from "@/components/ui/sonner"


import { Private, Public } from './components/Routing';



function App() {

  return (
    
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className="bg-[#121212] min-h-screen text-zinc-100">
        <Toaster />

        <Router>
          <Routes>
              <Route element={<Public/>}>
                <Route path='/signup' element={<SignUp />} />
                <Route path='/signin' element={<SignIn />} />
              </Route>


              <Route element={<Private/>}>
                <Route path='/feed' element={<Home />} />
                <Route path='/profile/:username' element={<Profile />} />
                <Route path='/notification' element={<Notification />} />
              </Route>

              <Route path='*' element={<Navigate to="/feed" replace /> } />


          </Routes>
        </Router>
      </div>
    </ThemeProvider>

  )
}

export default App
