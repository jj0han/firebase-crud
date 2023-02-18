import { useEffect, useState } from 'react'
import { orderBy, query, where } from 'firebase/firestore'
import { getDocs, collection, db } from '../firebase'
import Form from '../layouts/Form'

export default function Home({ sync, handleSignOut, setGetUsers, data, setData, addUser, all }) {
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
                    users = await getDocs(query(ref, where("text", "==", search)))
                }

                setGetUsers([])
                users.forEach((doc) => {
                    setGetUsers(old => [...old, { id: doc.id, userName: doc.data().userName, pic: doc.data().pic, text: doc.data().text, uid: doc.data().uid }])
                })
                document.querySelector('.lds-ring').style.display = "none"
            } catch (err) {
                window.alert("Não foi possível acessar o banco de dados no momento, por favor tente mais tarde...")
            }
        }
        readUsers(search)

    }, [search, sync.snapshot, sync.loading, sync.error, sync.values, setGetUsers])

    return (
        <div className="App">
            <nav className='nav'>
                <button onClick={handleSignOut} className="button-signout">Sign Out</button>
                <input className='search' value={search} onChange={handleSearch} placeholder="Search" type="text" />
            </nav>
            <div className='user-container'>
                <br />
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                <div className='messages'>{all}</div>
                <Form text={data.text} action={addUser} data={data} setData={setData} />
            </div>
        </div>
    )
}
