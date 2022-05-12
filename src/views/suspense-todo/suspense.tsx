import React, { useState, memo, useCallback, Suspense } from 'react'
import { css } from '@emotion/react'
import produce from 'immer'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import DoneIcon from '@mui/icons-material/Done'
import IconButton from '@mui/material/IconButton'
import { vanillaStyle, todoItemDoneStyle, todoItemStyle } from './style'
import useResource from './use-resource'
import { LoadingPage } from '../../layout'

interface Todo {
  title: string
  description?: string
  done: boolean
}

const TodoItem : React.FC<{
  todo: Todo,
  index?: number,
  toggleTodo: (i?: number) => void
}> = ({ todo, index, toggleTodo }) => {
  console.log('TodoItem', todo.title, 'render')

  return (
    <li css={[todoItemStyle, todo.done ? todoItemDoneStyle : null]}>
      <IconButton color="secondary" onClick={() => toggleTodo(index)}>
        { !todo.done ? <CropSquareIcon /> : <DoneIcon /> }
      </IconButton>
      <div className="content">
        <h3>{todo.title}</h3>
        { todo.description && <p>{todo.description}</p> }
      </div>
    </li>
  )
}

const MemoTodoItem = memo(TodoItem)

const TodoList : React.FC = () => {
  console.log('TodoList', 'render')

  const [todoList, setTodoList] = useState<Todo[]>(useResource() as Todo[])

  // 直接修改 state 内的深层属性
  const toggleTodo = (index: number) => {
    setTodoList(todoList => {
      todoList[index].done = !todoList[index].done
      return todoList
    })
  }

  // 修改时做一次外层浅拷贝
  const toggleTodoByReplace = (index: number) => {
    const newTodoList = [...todoList]
    newTodoList[index].done = !newTodoList[index].done
    setTodoList(newTodoList)
  }

  // 使用 immer 实现 state 的深层修改
  const toggleTodoByImmer = useCallback((index: number) => {
    setTodoList(produce(todoList => {
      todoList[index].done = !todoList[index].done
    }))
  }, [])

  const addTodo = () => {
    setTodoList(produce(todoList => {
      todoList.push({
        title: `New Todo ${(todoList.length + 1)}`,
        description: 'This is a new todo',
        done: false
      })
    }))
  }

  return (
    <div>
      <h2>
        <span>Suspense TODO</span>
        <IconButton color="secondary" onClick={addTodo}>
          <AddBoxIcon />
        </IconButton>
      </h2>
      <ul css={css`margin: 0; padding: 0`}>
        {
          /* todoList.map((todo, index) => (
            <MemoTodoItem key={index} todo={todo} index={index} toggleTodo={toggleTodoByImmer} />
          )) */
          todoList.map((todo, index) => (
            <TodoItem key={index} todo={todo} toggleTodo={() => toggleTodoByImmer(index)} />
          ))
        }
      </ul>
    </div>
  )
}

const VanillaTodo : React.FC = () => {
  console.log('VanillaTodo', 'render')

  return (
    <main css={vanillaStyle}>
      <LoadingPage text="TODO 数据加载中...">
        <TodoList />
      </LoadingPage>
    </main>
  )
}

export default VanillaTodo
