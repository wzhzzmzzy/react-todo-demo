import React, { memo, useCallback } from 'react'
import { jsx, css } from '@emotion/react'
import { connect, Provider } from 'react-redux'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import DoneIcon from '@mui/icons-material/Done'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { addTodo, toggleTodo, setFilter, Todo, selectTodoWithFilter, FILTER } from './store/todo-slice'
import { vanillaStyle, todoItemDoneStyle, todoItemStyle, todoItemChosenStyle } from './style'
import store, { useAppSelector, useAppDispatch, RootState } from './store'

interface TodoItemProps {
  todo: Todo,
  toggleTodo?: (id: number) => void,
  onInputTitle?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputDescription?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TodoItem : React.FC<TodoItemProps> = ({ todo, toggleTodo, onInputTitle, onInputDescription }) => {
  console.log('TodoItem', todo.title, 'render')

  return (
    <li css={[todoItemStyle, todo.done && todoItemDoneStyle, todo.chosen && todoItemChosenStyle]}>
      <IconButton color="secondary" onClick={() => toggleTodo?.(todo.id)}>
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

const MemoTodoItem = memo(TodoItem)

const TodoList : React.FC = () => {
  console.log('TodoList render')

  const todoList = useAppSelector(selectTodoWithFilter)
  const dispatch = useAppDispatch()

  const toggleTodoStatus = useCallback((id: number) => {
    dispatch(toggleTodo(id))
  }, [dispatch])

  return (
    <ul css={css`margin: 0; padding: 0`}>
      {
        todoList.map((todo) => (
          <MemoTodoItem key={todo.id} todo={todo} toggleTodo={toggleTodoStatus} />
        ))
      }
    </ul>
  )
}

const ReduxTodo : React.FC<{
  todoListFilter: FILTER,
  setFilter: (f: FILTER) => void
  addTodo: () => void
}> = ({ todoListFilter, setFilter, addTodo }) => {
  console.log('ReduxTodo', 'render')

  return (
    <main css={vanillaStyle}>
      <h2>
        <span>Redux TODO</span>
        <span>
          <Button onClick={() => setFilter(todoListFilter === 'all' ? 'incomplete' : 'all')}>
            {todoListFilter === 'all' ? '全部' : '未完成'}
          </Button>
          <IconButton color="secondary" onClick={addTodo}>
            <AddBoxIcon />
          </IconButton>
        </span>
      </h2>
      <TodoList />
    </main>
  )
}

const ReduxTodoWithRedux = connect(
  (state: RootState) => ({
    todoListFilter: state.todo.filter
  }),
  dispatch => ({
    setFilter: (filter: FILTER) => dispatch(setFilter(filter)),
    addTodo: () => dispatch(addTodo())
  })
)(ReduxTodo) as unknown as () => JSX.Element

const ReduxTodoPage : React.FC = () => {
  return (
    <Provider store={store}>
      <ReduxTodoWithRedux />
    </Provider>
  )
}

export default ReduxTodoPage
