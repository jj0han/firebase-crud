import './App.css'
import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { addDoc, deleteDoc, collection, db, doc } from './firebase'
import { auth, handleSignInWithGoogle, handleSignOut } from './auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Update from './pages/Update'
import Home from './pages/Home'
import SignIn from './pages/SignIn'

export default function App() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState({ id: "", text: "" })
  const [updateData, setUpdateData] = useState({ id: "", text: "" })
  const [getUsers, setGetUsers] = useState([])

  const ref = collection(db, "data")
  const [values, loading, error, snapshot] = useCollectionData(ref)
  let sync = {
    values,
    loading,
    error,
    snapshot
  }

  function clearInputs() {
    setData({ id: "", text: "" })
  }

  const addUser = async (e) => {
    e.preventDefault()
    try {
      await addDoc(ref, { userName: auth.currentUser.displayName, text: data.text, date: Date.now(), pic: user.photoURL, uid: auth.currentUser.uid })
      clearInputs()
      const messages = document.querySelector(".messages")
      messages.scrollTop = messages.scrollHeight
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
    if (!user) return ""

    return (
      <div className={"user-message"} key={doc.id}>
        <div className='user-message__container'>
          <img className='user-pic' src={doc.pic} alt="profile pic" />
          <div>
            <p className='user-message__username'>{doc.userName}</p>
            <p className='user-message__text'>{doc.text}</p>
          </div>
        </div>
        {
          //garantia que o usuário poderá somente editar e deletar as próprias mensagens
          auth.currentUser.uid === doc.uid ? (
            <div className='user-message__edit'>
              <Link title='edit' className='button-update' onClick={updateUser} to={`update/${doc.id}`} id={doc.id}></Link>
              <button title='delete' className='button-delete' id={doc.id} onClick={deleteUser}></button>
            </div>
          ) : (
            ""
          )
        }

      </div>
    )
  })

  return (
    <Routes>
      {user ? (
        <>
          <Route path='/concord-chat' element={<Home sync={sync} handleSignOut={() => handleSignOut(setUser)} setGetUsers={setGetUsers} data={data} setData={setData} addUser={addUser} all={all} />} />
          <Route path='concord-chat/update/*' element={<Update id={updateData.id} text={updateData.text} />} />
          <Route path='*' element={<Navigate to={"/concord-chat"} />} />
        </>
      ) : (
        <>
          <Route path='concord-chat/sign-in-with-google' element={<SignIn handleSignInWithGoogle={() => handleSignInWithGoogle(setUser)} />} />
          <Route path='*' element={<Navigate to={"concord-chat/sign-in-with-google"} />} />
        </>
      )
      }
    </Routes>
  )
}