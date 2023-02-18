import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const provider = new GoogleAuthProvider()
const auth = getAuth()

function handleSignInWithGoogle(setUser) {
    signInWithPopup(auth, provider).then((res) => {
        setUser(res.user)
    }).catch((err) => {
        console.log("Erro ao logar com Google", err)
    })
}

function handleSignOut(setUser) {
    signOut(auth).then(() => {
        setUser(null)
    }).catch((err) => {
        console.log("Erro ao deslogar da conta", err)
    })
}

export { handleSignInWithGoogle, handleSignOut, auth }