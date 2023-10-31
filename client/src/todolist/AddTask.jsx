import { Box, Button, Container, Divider, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

/**
  * @param {AddTaskProps} props 
 */
export default function AddTask(props) {
    const [title, setTitle] = useState('')  // State var
    return (
        <>
            <Container maxWidth='sm'>
                <Box sx={{
                    my: 2, 
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add task
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    </Typography>
                   
                    <Box component={'form'}
                        onSubmit={(event) => {
                            event.preventDefault()
                            if (!title) return;                           
                            props.setTasks((prevState) => {
                                //prevState = tasks
                                // Immutable
                                return [...prevState, {
                                    id: prevState[prevState.length - 1].id + 1,
                                    title,
                                    done: false
                                }]
                            })
                            setTitle('')
                        }}
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch ', // center 
                            gap: 2 // 2 * 8px  // 1 rem/2 = 8px
                        }}>
                        <TextField  
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value)
                        }}
                        name='title' /> 
                        {/*HTMLInputElement */}
                        <Button variant='contained' type='submit'>Add</Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}
