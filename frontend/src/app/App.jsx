import React from 'react'
import { useSelector } from 'react-redux'
import { hello } from '../features/auth/service/auth.api'
import { use } from 'react'
import { useEffect } from 'react'
import useAuth from '../features/auth/hook/useAuth'

const App = () => {

  const user = useSelector(state => state.auth.user)
  const {handleRefresh} = useAuth()

  useEffect(()=>{

    handleRefresh()
    
  },[])


 hello().then(res => console.log(res))

  return (
    <div className='text-3xl text-blue-800 '>
      hello world 

    </div>
  )
}

export default App
