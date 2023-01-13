import '../App.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateDoc, doc, db } from '../firebase'
import Form from '../layouts/Form'

export default function Update({ id, name, age }) {
    const [data, setData] = useState({ id: id, name: name, age: age })
    const navigate = useNavigate()

    const updateUser = async (e) => {
        e.preventDefault()
        try {
            await updateDoc(doc(db, "data", id), data)
            navigate('/firebase-crud')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <p>Updating <strong>{name}:</strong></p>
            <Form name={data.name} age={data.age} action={updateUser} data={data} setData={setData} />
            <Link to={'/firebase-crud'}>Cancel</Link>
        </div>
    )
}