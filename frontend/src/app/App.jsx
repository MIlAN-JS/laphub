import React from 'react'
import { useSelector } from 'react-redux'
import { use } from 'react'
import { useEffect } from 'react'
import useAuth from '../features/auth/hook/useAuth'
import { Outlet } from 'react-router-dom'


const App = () => {
  const user = useSelector(state => state.auth.user)
  const {handleRefresh } = useAuth()
  console.log(user)

  useEffect(()=>{

    handleRefresh()
   
   
    
  },[])



  return (
    <div className='text-3xl text-blue-800 '>
     <Outlet/>
     hello

    </div>
  )
}

export default App
