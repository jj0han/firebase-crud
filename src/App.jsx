import './App.css'
import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { addDoc, deleteDoc, collection, db, doc } from './firebase'
import Update from './pages/Update'
import Home from './pages/Home'

export default function App() {
  const [data, setData] = useState({ id: "", name: "" })
  const [updateData, setUpdateData] = useState({ id: "", name: ""})
  const [getUsers, setGetUsers] = useState([])
  const ref = collection(db, "data")

  function clearInputs() {
    setData({ id: "", name: ""})
  }

  const addUser = async (e) => {
    e.preventDefault()
    try {
      await addDoc(ref, { name: data.name, date: Date.now() })
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
    let name
    getUsers.forEach((user) => {
      if (user.id === id) {
        name = user.name
      }
    })
    setUpdateData({ id: id, name: name})
  }

  const all = getUsers.map((doc) => {
    return (
      <div className='user-info' key={doc.id}>
        <p>{doc.name}<br/>{doc.age}</p>
        <div>
          <Link onClick={updateUser} to={`/update/${doc.id}`} className='button-update' id={doc.id}>Update</Link>
          <button className='button-delete' id={doc.id} onClick={deleteUser}>Delete</button>
        </div>
      </div>
    )
  })

  return (
    <Routes>
      <Route path='*' element={<Navigate to={"/firebase-crud"}/>}/>
      <Route path='/firebase-crud' element={<Home getUsers={getUsers} setGetUsers={setGetUsers} data={data} setData={setData} addUser={addUser} deleteUser={deleteUser} all={all} />} />
      <Route path='update/*' element={<Update id={updateData.id} name={updateData.name} age={updateData.age} />} />
    </Routes>
  )
}