import '../App.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateDoc, doc, db } from '../firebase'
import Form from '../layouts/Form'

export default function Update({ id, text }) {
    const [data, setData] = useState({ id: id, text: text })
    const navigate = useNavigate()

    const updateMessage = async (e) => {
        e.preventDefault()
        try {
            await updateDoc(doc(db, "data", id), data)
            navigate('concord-chat')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='user-container'>
            <p>Editing <strong>{text}:</strong></p>
            <Form text={data.text} action={updateMessage} data={data} setData={setData} />
            <br/>
            <Link to={'/'} className="button-cancel">Cancel</Link>
        </div>
    )
}
