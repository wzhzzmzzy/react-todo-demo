import React, { useState } from 'react';
import { jsx, css } from '@emotion/react';
import produce from "immer";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DoneIcon from '@mui/icons-material/Done';
import IconButton from '@mui/material/IconButton';
import { vanillaStyle, todoItemDoneStyle, todoItemStyle } from './style'

interface Todo {
  title: string
  description?: string
  done: boolean
}

const TodoItem : React.FC<{ todo: Todo, toggleTodo: () => void }> = ({ todo, toggleTodo }) => {
  return (
    <li css={[todoItemStyle, todo.done ? todoItemDoneStyle : null]}>
      <IconButton color="secondary" onClick={toggleTodo}>
        { !todo.done ? <CropSquareIcon /> : <DoneIcon /> }
      </IconButton>
      <div className="content">
        <h3>{todo.title}</h3>
        { todo.description && <p>{todo.description}</p> }
      </div>
    </li>
  )
}

const TodoList : React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([
    {
      title: 'Todo 1',
      description: 'This is a todo',
      done: false
    },
    {
      title: 'Todo 2',
      description: 'This is a todo',
      done: false
    },
    {
      title: 'Todo 3',
      description: 'This is a todo',
      done: false
    }
  ])

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
  const toggleTodoByImmer = (index: number) => {
    setTodoList(produce(todoList => {
      todoList[index].done = !todoList[index].done
    }))
  }

  return (
    <ul css={css`margin: 0; padding: 0`}>
      {
        todoList.map((todo, index) => (
          <TodoItem key={index} todo={todo} toggleTodo={() => toggleTodoByReplace(index)} />
        ))
      }
    </ul>
  )
}

const VanillaTodo : React.FC = () => {
  return (
    <main css={vanillaStyle}>
      <h2>
        <span>初级 TODO</span>
        <IconButton color="secondary">
          <AddBoxIcon />
        </IconButton>
      </h2>
      <TodoList />
    </main>
  )
}

export default VanillaTodo
