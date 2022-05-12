import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector, devtools, redux } from 'zustand/middleware'

export interface Todo {
  id: number
  title: string
  description?: string
  done: boolean
  chosen: boolean
}

export type FILTER = 'all' | 'incomplete'

interface TodoState {
  value: Todo[]
  filter: FILTER
  multiChoose: boolean
  setMultiChoose: (multiChoose: boolean) => void
  setFilter: (filter: FILTER) => void
  addTodo: () => void
  deleteTodo: () => void
  updateTodo: (fields: Partial<Todo> & { id: number }) => void
  chooseTodo?: (id: number, status: boolean) => void
}

export const useTodoStore = create<TodoState>()(subscribeWithSelector(devtools(immer(set => {
  const localStorageData = JSON.parse(localStorage.getItem('zustand-todo') || 'null') as Todo[]

  return {
    value: localStorageData || [],
    filter: 'all',
    multiChoose: false,
    setMultiChoose: (multiChoose: boolean) => set(state => {
      state.multiChoose = multiChoose
    }),
    setFilter: (filter) => set((state: TodoState) => {
      state.filter = filter
    }),
    addTodo: () => set((state: TodoState) => {
      state.value.push({
        id: state.value.length,
        title: `New Todo ${(state.value.length + 1)}`,
        description: '',
        done: false,
        chosen: false
      })
    }),
    deleteTodo: () => set((state: TodoState) => {
      const newState = state.value.filter(todo => !todo.chosen)
      if (newState.length !== state.value.length) {
        state.value = newState
      }
    }),
    updateTodo: (fields) => set((state) => {
      const i = state.value.findIndex(todo => todo.id === fields.id)
      state.value[i] = { ...state.value[i], ...fields }
    }),
  }
}))))
