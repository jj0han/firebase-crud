import { useEffect, useState } from 'react'
import { orderBy, query, where } from 'firebase/firestore'
import { getDocs, collection, db } from '../firebase'
import Form from '../layouts/Form'

export default function Home({ getUsers, setGetUsers, data, setData, addUser, deleteUser, all }) {
    const [search, setSearch] = useState("")
    const ref = collection(db, "data")

    function handleSearch(e) {
        setSearch(e.target.value)
    }

    useEffect(() => {
        const readUsers = async (search) => {
            let users = ""
            try {
                if (search.trim() === "") {
                    users = await getDocs(query(ref, orderBy("name")))
                } else {
                    users = await getDocs(query(ref, where("name", "==", search)))
                }

                setGetUsers([])
                users.forEach((doc) => {
                    setGetUsers(old => [...old, { id: doc.id, name: doc.data().name, age: doc.data().age }])
                })
                document.querySelector('.lds-ring').style.display = "none"
            } catch (err) {
                console.log(err)
            }
        }
        readUsers(search)
    }, [addUser, deleteUser, search, ref, setGetUsers])

    return (
        <div className="App">
            <h1 className='title'>TFF - Teste Firebase</h1>
            <Form name={data.name} age={data.age} action={addUser} data={data} setData={setData} />
            <div className='user-container'>
                <h2 className='users-title'>usuários</h2>
                <input className='input' value={search} onChange={handleSearch} placeholder="procurar" type="text" />
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                {all}
            </div>
        </div>
    )
}
