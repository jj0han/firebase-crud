import './App.css'
import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { addDoc, deleteDoc, collection, db, doc } from './firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import Update from './pages/Update'
import Home from './pages/Home'
import SignIn from './pages/SignIn'

export default function App() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState({ id: "", text: "" })
  const [updateData, setUpdateData] = useState({ id: "", text: "" })
  const [getUsers, setGetUsers] = useState([])
  
  const ref = collection(db, "data")
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  function handleSignInWithGoogle() {
    signInWithPopup(auth, provider).then((res) => {
      setUser(res.user)
    }).catch((err) => {
      console.log("Erro ao logar com Google", err)
    })
  }

  function handleSignOut() {
    signOut(auth).then(() => {
      setUser(null)
    }).catch((err) => {
      console.log("Erro ao deslogar da conta", err)
    })
  }

  function clearInputs() {
    setData({ id: "", text: "" })
  }

  const addUser = async (e) => {
    e.preventDefault()
    try {
      await addDoc(ref, { text: data.text, date: Date.now(), pic: user.photoURL })
      clearInputs()
      setGetUsers([])
    } catch (err) {
      console.log(err)
    }
  }

  const deleteUser = async (e) => {
    const id = e.target.id
    const confirm = window.confirm("Tem certeza de deletar este item?")
    if (confirm === false) return
    try {
      await deleteDoc(doc(db, "data", id))
      setGetUsers([])
    } catch (err) {
      console.log(err)
    }
  }

  const updateUser = async (e) => {
    const id = e.target.id
    let text
    getUsers.forEach((user) => {
      if (user.id === id) {
        text = user.text
      }
    })
    setUpdateData({ id: id, text: text })
  }

  const all = getUsers.map((doc) => {
    return (
      <div className='user-info' key={doc.id}>
        <img src={doc.pic} alt="profile pic" />
        <p>{doc.text}</p>
        <div>
          <Link onClick={updateUser} to={`/update/${doc.id}`} className='button-update' id={doc.id}>Update</Link>
          <button className='button-delete' id={doc.id} onClick={deleteUser}>Delete</button>
        </div>
      </div>
    )
  })

  return (
    <>
      {user ?
        (<Routes>
          <Route path='*' element={<Navigate to={"/firebase-crud"} />} />
          <Route path='/firebase-crud' element={<Home name={user.displayName} handleSignOut={handleSignOut} setGetUsers={setGetUsers} data={data} setData={setData} addUser={addUser} all={all} />} />
          <Route path='update/*' element={<Update id={updateData.id} text={updateData.text} age={updateData.age} />} />
        </Routes>) : (
          <SignIn handleSignInWithGoogle={handleSignInWithGoogle} />
        )
      }
    </>
  )
}