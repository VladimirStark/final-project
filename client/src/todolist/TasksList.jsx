import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/material';
import EditTask from './EditTask';
import { useState } from 'react';

/** 
 * JSDoc comment
 * @param {TasksListProps} props 
 */
export default function TasksList(props) {
    const [editOpen, setEditOpen] = useState(false)
    const [editTaskId, setEditTaskId] = useState(-1)
    /** 
 * @param {Task} task 
 */

    function handleToggle(task) {
        const taskId = task.id
        props.setTasks((tasks) => { // callback
            // Immutable logic
            return tasks.map((task) => {
                return (task.id === taskId)
                    ? ({ ...task, done: !task.done })
                    : task
            })
        })
    }
    return (
        <Container maxWidth='sm'>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {props.tasks.map((task) => {
                    const labelId = `checkbox-list-label-${task.title}`;

                    return (
                        <ListItem
                            key={task.id}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        aria-label="comments"
                                        sx={{
                                            mr: 0
                                        }}
                                        onClick={() => {
                                            setEditTaskId(task.id)
                                            setEditOpen(true)
                                        }}>
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        edge="end"
                                        aria-label="comments"
                                        onClick={() => {
                                            if (confirm('Are you sure?'))
                                           props.setTasks((prevState) =>{
                                            const taskId = task.id
                                            return prevState.filter((task) => {
                                                return taskId !== task.id
                                            })
                                           })
                                        }}>
                                        <DeleteIcon />
                                    </IconButton>

                                </>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                role={undefined}
                                onClick={() => handleToggle(task)}
                                sx={{
                                  '&.MuiListItemButton-root': {
                                        paddingRight: 10
                                    },
                                }}
                                dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={task.done}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={task.title} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <EditTask
                open={editOpen}
                setOpen={setEditOpen}
                task={props.tasks.find((task) => {
                    return task.id === editTaskId
                })}
                setTasks={props.setTasks}
            />
        </Container>
    );
}