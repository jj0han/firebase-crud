export default function SignIn({ handleSignInWithGoogle }) {
  return (
    <div className="user-container">
        <button className="search" onClick={handleSignInWithGoogle}>Sign In With Google</button>
    </div>
  )
}
