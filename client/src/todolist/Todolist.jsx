import { Container, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TasksList from './TasksList'
import AddTask from './AddTask'

const initialTasks = [
    {
      id: 1,
      title: 'Learn JS',
      done: true
    },
    {
      id: 2,
      title: 'Learn React',
      done: false
    }
  ]

export default function Todolist() {
  const tasksStore = localStorage.getItem('tasks')
  ? JSON.parse(localStorage.getItem('tasks') || 'null')
  : null
    const [tasks, setTasks] = useState(tasksStore || initialTasks) // React hook
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])
  return (
    <Container maxWidth='xl'>
      <Typography 
      variant='h4' 
      component='h1'
        sx={{
          my: 4,
          textAlign: 'center'
        }}
      >
          Personal task manager
      </Typography>
      <Divider></Divider> 
      <AddTask setTasks={setTasks}/>
      <Divider></Divider>
      <TasksList tasks={tasks} setTasks={setTasks} ></TasksList>     
    </Container>
  )
}
