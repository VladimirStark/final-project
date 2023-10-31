type Task = {
    id: number;
    title: string;
    done: boolean;
}

type TasksListProps = {
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

type EditTaskProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    task: Task |  undefined
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

type AddTaskProps = {
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}