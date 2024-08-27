'use client'
import React, { useEffect, useRef, useState } from 'react'

type Todo = {
  id: number;
  text: string;
}

const ToDo = () => {
  const [todoList, setTodoList] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(null)
  const [editText, setEditText] = useState('')

  const addText = () => {
    const inputText = inputRef.current?.value.trim();
    
    if (!inputText) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
    };

    setTodoList((prev) => [...prev, newTodo]);
    if (inputRef.current) inputRef.current.value = '';
  }

  const deleteTodo = (id: number) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  }

  const editTodo = (id:any) => {
    const toEdit = todoList.find(todo => todo.id === id)
    if (toEdit) {
      setIsEditing(id)
      setEditText(toEdit.text)
    }
  }
  const saveEdit = (id:any) => {
    if (!editText.trim()) return null

    setTodoList((pre) => pre.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    ))
    setIsEditing(null)
    setEditText('')
  }

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todoList));
  }, [todoList]);

  return (
    <div className='w-full h-screen flex items-center justify-center p-8'>
      <div className="w-full sm:w-[520px] rounded-[20px] text-center p-5 flex flex-col gap-6 bg-[#001529] text-[#d1d5db]">
        <div className="text-3xl font-semibold">To-Do List</div>
        <div className="rounded-full flex items-center bg-[#1f2940]">
          <input 
            ref={inputRef}
            type="text" 
            placeholder='Type your task'
            className='border-none outline-none p-3 bg-transparent flex-1'
          />
          <button 
          className='p-3 px-6 rounded-full' onClick={addText}
          style={{ backgroundImage: 'linear-gradient(90deg, #9333ea, #d14fdf)' }}
          >
            Add
          </button>
        </div>

        {todoList.length > 0 ? <div>
          {todoList.map((item) => (
            <div className='flex items-center justify-between px-4 py-2'>
              <input 
                type="text" 
                value={isEditing === item.id ? editText : item.text}
                readOnly={isEditing === item.id ? false : true} 
                onChange={(e) => setEditText(e.target.value)} 
                className={`bg-transparent outline-none w-1/2  ${isEditing === item.id ? 'border-b' : ''}`}
              />
      
              <div className="flex items-center gap-4">
                {isEditing === item.id ? (
                  <button 
                  className='cursor-pointer text-purple-600' 
                  onClick={() => saveEdit(item.id)}>
                    Update
                  </button>
                ) : (
                  <>
                    <button
                    className='cursor-pointer text-purple-600' 
                    onClick={() => editTodo(item.id)}
                    >Edit</button>
                    <button
                    className='cursor-pointer text-purple-600' 
                    onClick={() => deleteTodo(item.id)}
                    >Delete</button>
                  </>
                  )}
              </div>
            </div>
          ))}
        </div> : <div className="opacity-50">Add your To-Do</div>}
      </div>
    </div>
  )
}

export default ToDo;
