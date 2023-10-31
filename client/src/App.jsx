import * as React from "react"
import { useState } from "react"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MainAppBar from "./AppBar";
import Todolist from "./todolist/Todolist";




const initialUserInfo = {
  name: 'John Smith',
  email: 'john.smith@gmail.com'
}

function App() {
 
  const [userinfo, setUserinfo] = useState(initialUserInfo)

  return (
    <>
      <MainAppBar />
      <Todolist />
    </>
  )
}

export default App
