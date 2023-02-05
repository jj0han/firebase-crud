export default function Form({ name, action, data, setData }) {
  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form className='form' onSubmit={action}>
      <input required={true} className='input' onChange={handleChange} placeholder={"Info"} value={name} name='name' type="text" />
      <button className='button-submit' type="submit">Submit</button>
    </form>
  )
}
