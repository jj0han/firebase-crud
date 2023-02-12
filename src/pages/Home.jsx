import { useEffect, useState } from 'react'
import { orderBy, query, where } from 'firebase/firestore'
import { getDocs, collection, db } from '../firebase'
import Form from '../layouts/Form'

export default function Home({ setGetUsers, data, setData, addUser, all }) {
    const [search, setSearch] = useState("")

    function handleSearch(e) {
        setSearch(e.target.value)
    }

    useEffect(() => {
        const ref = collection(db, "data")
        const readUsers = async (search) => {
            let users = ""
            try {
                if (search.trim() === "") {
                    users = await getDocs(query(ref, orderBy("date")))
                } else {
                    users = await getDocs(query(ref, where("name", "==", search)))
                }

                setGetUsers([])
                users.forEach((doc) => {
                    setGetUsers(old => [...old, { id: doc.id, name: doc.data().name }])
                })
                document.querySelector('.lds-ring').style.display = "none"
            } catch (err) {
                window.alert("Não foi possível acessar o banco de dados no momento, por favor tente mais tarde...")
            }
        }
        readUsers(search)
        
    }, [search, setGetUsers, addUser])

    // useEffect(() => {
    //     const messages = document.querySelector(".messages")
    //     messages.scrollTop = messages.scrollHeight
    // }, [])

    return (
        <div className="App">
            <div className='user-container'>
                <input className='search' value={search} onChange={handleSearch} placeholder="Search" type="text" />
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                <div className='messages'>{all}</div>
                <Form name={data.name} action={addUser} data={data} setData={setData} />
            </div>
        </div>
    )
}
