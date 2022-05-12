import React, { useEffect } from 'react'
import { css } from '@emotion/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import DoneIcon from '@mui/icons-material/Done'
import IconButton from '@mui/material/IconButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { useTodoStore, Todo } from './store'
import { todoItemChosenStyle, todoItemDoneStyle, todoItemStyle, vanillaStyle } from './style'
import { sortBy } from 'lodash-es'
import shallow from 'zustand/shallow'

interface TodoItemProps {
  todo: Todo,
}

const TodoItem : React.FC<TodoItemProps> = ({ todo }) => {
  console.log('TodoItem', todo.title, 'render')

  const { updateTodo, chooseTodo } = useTodoStore(state => ({
    updateTodo: state.updateTodo,
    chooseTodo: state.chooseTodo
  }), shallow)

  const onToggleTodo = () => updateTodo({ id: todo.id, done: !todo.done })
  const onInputTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateTodo({ id: todo.id, title: e.target.value })
  const onInputDescription = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateTodo({ id: todo.id, description: e.target.value })
  const onChoose = () => updateTodo({
    id: todo.id, chosen: !todo.chosen
  })

  return (
    <li css={[todoItemStyle, todo.done && todoItemDoneStyle, todo.chosen && todoItemChosenStyle]} onClick={onChoose}>
      <IconButton color="secondary" onClick={onToggleTodo}>
        { !todo.done ? <CropSquareIcon /> : <DoneIcon /> }
      </IconButton>
      <div className="content">
        <TextField label="标题" variant="outlined" size="small" value={todo.title} onInput={onInputTitle} />
        {
          todo.description &&
          <TextField
            label="描述"
            multiline
            maxRows={4}
            variant="standard"
            size="small"
            value={todo.description}
            onInput={onInputDescription}
          />
        }
      </div>
    </li>
  )
}

const MemoTodoItem = React.memo(TodoItem)

const TodoList : React.FC = () => {
  console.log('TodoList render')
  const todoList = useTodoStore(state => {
    const todoList = state.filter === 'incomplete'
      ? state.value.filter(todo => !todo.done)
      : state.value
    return sortBy(todoList, (i: Todo) => -i.id)
  }, shallow)

  return (
    <ul css={css`margin: 0; padding: 0`}>
      {
        todoList.map((todo) => (
          <MemoTodoItem key={todo.id} todo={todo} />
        ))
      }
    </ul>
  )
}

const ZustandTodo : React.FC = () => {
  console.log('ZustandTodo', 'render')
  const { filter, setMultiChoose, setFilter, addTodo, deleteTodo } = useTodoStore(state => ({
    filter: state.filter,
    setMultiChoose: state.setMultiChoose,
    setFilter: state.setFilter,
    addTodo: state.addTodo,
    deleteTodo: state.deleteTodo
  }), shallow)

  useEffect(() => {
    return useTodoStore.subscribe(state => state.value, (state) => {
      window.localStorage.setItem('zustand-todo', JSON.stringify(state))
    })
  }, [useTodoStore])

  useEffect(() => {
    const listener = (type: 'down' | 'up') => (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        setMultiChoose(type === 'down')
      }
    }
    const downListener = listener('down')
    document.addEventListener('keydown', downListener)
    const upListener = listener('up')
    document.addEventListener('keyup', upListener)
    return () => {
      document.removeEventListener('keydown', downListener)
      document.removeEventListener('keyup', upListener)
    }
  }, [setMultiChoose])

  return (
    <main css={vanillaStyle}>
      <h2>
        <span>Zustand TODO</span>
        <span>
          <Button onClick={() => setFilter(filter === 'all' ? 'incomplete' : 'all')}>
            {filter === 'all' ? '全部' : '未完成'}
          </Button>
          <IconButton color="secondary" onClick={deleteTodo}>
            <DeleteForeverIcon />
          </IconButton>
          <IconButton color="secondary" onClick={addTodo}>
            <AddBoxIcon />
          </IconButton>
        </span>
      </h2>
      <TodoList />
    </main>
  )
}

export default ZustandTodo
