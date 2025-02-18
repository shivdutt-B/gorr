import React, { useEffect } from 'react'

function AuthDone() {
    useEffect(() => {
        console.log("user data",window.location)
    })
  return (
    <div>AuthDone</div>
  )
}

export default AuthDone