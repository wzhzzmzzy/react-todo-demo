import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
import { sortBy } from 'lodash-es'
import { RootState } from './index'

export interface Todo {
  id: number
  title: string
  description?: string
  done: boolean
  chosen: boolean
}

export type FILTER = 'all' | 'incomplete'

interface State {
  value: Todo[]
  filter: FILTER
}

const initialState: State = {
  value: [],
  filter: 'all'
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
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
    setFilter: (state, action: PayloadAction<FILTER>) => {
      state.filter = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addTodo, toggleTodo, setFilter } = todoSlice.actions

export const selectTodo = (state: RootState) => state.todo.value
export const selectFilter = (state: RootState) => state.todo.filter

export const selectTodoWithFilter = (state: RootState) => {
  const todoList = state.todo.filter === 'incomplete'
    ? state.todo.value.filter(todo => !todo.done)
    : state.todo.value
  return sortBy(todoList, (i: Todo) => -i.id)
}

export default todoSlice.reducer
