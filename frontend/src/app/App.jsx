import React from 'react'
import { useSelector } from 'react-redux'


const App = () => {

  const user = useSelector(state => state.auth.user)

  console.log(user , "user is")


  return (
    <div className='text-3xl text-blue-800 '>
      hello world 

    </div>
  )
}

export default App
