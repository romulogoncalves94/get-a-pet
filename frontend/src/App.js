import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

/* Pages */
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import AddPet from './components/pages/Pets/AddPet'
import MyPets from './components/pages/Pets/MyPets'
import EditPet from './components/pages/Pets/EditPet'

/* Components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'


/* Context */
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
      <Navbar />
        <Message />
        <Container>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/user/profile' element={<Profile />}/>
          <Route path='/pet/mypets' element={<MyPets />}/>
          <Route path='/pet/add' element={<AddPet />}/>
          <Route path='/pet/edit/:id' element={<EditPet />}/>
          <Route path='/' element={<Home />}/>
        </Routes>
        </Container>
      <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
