import { Modal, Box, Typography, Divider, Button, TextField } from '@mui/material'
import React from 'react'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
/**
 * @param {EditTaskProps} props 
 */
export default function EditTask(props) {
    const task = props.task
    return (
        <>
            <Modal
                open={props.open}
                onClose={() => props.setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit task
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    </Typography>
                    <Divider />
                    <Box component={'form'}
                        onSubmit={(event) => {
                            event.preventDefault()
                            const form = event.target 
                            const formData = new FormData(form)
                            const title = formData.get('title')
                            if (typeof title !== 'string') return;
                            props.setTasks((prevState) => {
                                //prevState = tasks
                                // Immutable
                                return prevState.map((task) => {
                                    if (task.id === props.task?.id) {
                                        return {...task, title}                                        
                                    } else {
                                        return task
                                    }
                                })
                            })
                            props.setOpen(false)
                        }}
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch ', // center 
                            gap: 2 // 2 * 8px  // 1 rem/2 = 8px
                        }}>
                        <TextField defaultValue={task?.title} name='title' /> {/*HTMLInputElement */}
                        <Button variant='contained' type='submit'>Edit</Button>
                    </Box>
                </Box>
            </Modal>

        </>
    )
}
