export default function Form({ text, action, data, setData }) {
  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form className='form' onSubmit={action}>
      <input required={true} autoComplete={"off"} className='input' onChange={handleChange} placeholder={"Message"} value={text} name='text' type="text" />
      <button className='button-submit' type="submit">Submit</button>
    </form>
  )
}