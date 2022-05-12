/* tslint:disable */

import React, { useContext, useEffect, useReducer } from 'react'
import produce from 'immer'
import { sortBy } from 'lodash-es'
import { PayloadAction } from '@reduxjs/toolkit'
import { css } from '@emotion/react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import DoneIcon from '@mui/icons-material/Done'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { vanillaStyle, todoItemDoneStyle, todoItemStyle, todoItemChosenStyle } from './style'
import { Todo } from '../redux-todo/store/todo-slice'

const TodoListContext = React.createContext(null)

interface TodoItemProps {
  todo: Todo,
}

const TodoItem : React.FC<TodoItemProps> = ({ todo }) => {
  console.log('TodoItem', todo.title, 'render')
  const { dispatch } = useContext(TodoListContext)

  const onToggleTodo = () => dispatch({
    type: 'toggleTodo',
    payload: todo.id
  })
  const onInputTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: 'updateTodo',
      payload: { id: todo.id, title: e.target.value }
    })
  const onInputDescription = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: 'updateTodo',
      payload: { id: todo.id, description: e.target.value }
    })

  return (
    <li css={[todoItemStyle, todo.done && todoItemDoneStyle, todo.chosen && todoItemChosenStyle]}>
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

const TodoList = () => {
  console.log('TodoList', 'render')
  const { state } = useContext(TodoListContext)

  return (
    <ul css={css`margin: 0; padding: 0`}>
      {
        sortBy(state.value, (i: Todo) => -i.id).map((todo) => (
          <MemoTodoItem key={todo.id} todo={todo} />
        ))
      }
    </ul>
  )
}

const ContextTodo = () => {
  console.log('ContextTodo', 'render')

  const { state, dispatch } = useContext(TodoListContext)

  const addTodo = () => dispatch({
    type: 'addTodo',
  })

  return (
    <main css={vanillaStyle}>
      <h2>
        <span>Context TODO</span>
        <IconButton color="secondary" onClick={addTodo}>
          <AddBoxIcon />
        </IconButton>
      </h2>
      <TodoList />
    </main>
  )
}

const todoReducer = {
  addTodo: (state) => {
    state.value.push({
      id: state.value.length,
      title: `New Todo ${(state.value.length + 1)}`,
      description: '',
      done: false,
      chosen: false
    })
  },
  toggleTodo: (state, action: PayloadAction<number>) => {
    const i = state.value.findIndex(todo => todo.id === action.payload)
    state.value[i].done = !state.value[i].done
  },
  updateTodo: (state, action: PayloadAction<Partial<Todo> & { id: number }>) => {
    const i = state.value.findIndex(todo => todo.id === action.payload.id)
    state.value[i] = { ...state.value[i], ...action.payload }
  }
}

const ContextTodoPage = () => {
  const [state, dispatch] = useReducer((state, action) => {
    if (todoReducer[action.type]) {
      return produce(todoReducer[action.type])(state, action)
    } else {
      throw new Error('unknown action')
    }
  },null, (state) => {
    console.log('ContextTodoPage', 'render')
    return JSON.parse(window.localStorage.getItem('context-todo') || 'null') || {
      value: [],
    }
  })

  useEffect(() => {
    window.localStorage.setItem('context-todo', JSON.stringify(state))
  }, [state])

  return (
    <TodoListContext.Provider value={{ state, dispatch }}>
      <ContextTodo />
    </TodoListContext.Provider>
  )
}

export default ContextTodoPage
