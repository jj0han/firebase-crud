export default function Form({ name, age, action, data, setData }) {
  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form className='form' onSubmit={action}>
      <input required={true} className='input' onChange={handleChange} placeholder={"name"} value={name} name='name' type="text" />
      <input required={true} className='input' onChange={handleChange} placeholder={"age"} value={age} name='age' type="number" />
      <button className='button-submit' type="submit">Submit</button>
    </form>
  )
}
