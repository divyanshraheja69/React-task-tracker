import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import './App.css';

function TodoItem({ item, index, onDelete, onComplete, isCompletedScreen, moveTodo }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TODO_ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TODO_ITEM',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index, isCompletedScreen);
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity }} className="todo-list-item">
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {isCompletedScreen && <p> <i>Completed at: {item.completedOn}</i></p>}
      </div>
      <div>
        <AiOutlineDelete
          title="Delete?"
          className="icon"
          onClick={() => onDelete(index, isCompletedScreen)}
        />
        {!isCompletedScreen && (
          <BsCheckLg
            title="Completed?"
            className="check-icon"
            onClick={() => onComplete(index)}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const [allTodos, setAllTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedToDos = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodos) {
      setAllTodos(savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos(savedCompletedToDos);
    }
  }, []);

  const handleAddNewToDo = () => {
    let newToDoObj = {
      title: newTodoTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newToDoObj);

    setAllTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    setNewDescription('');
    setNewTodoTitle('');
  };

  const handleToDoDelete = (index, isCompleted) => {
    let updatedTodos = isCompleted ? [...completedTodos] : [...allTodos];

    updatedTodos.splice(index, 1);

    if (isCompleted) {
      setCompletedTodos(updatedTodos);
      localStorage.setItem('completedTodos', JSON.stringify(updatedTodos));
    } else {
      setAllTodos(updatedTodos);
      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    }
  };

  const handleComplete = (index) => {
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var minutes = date.getMinutes();
    var ss = date.getSeconds();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredTodo = {
      ...allTodos[index],
      completedOn: finalDate,
    };

    let updatedCompletedList = [...completedTodos, filteredTodo];
    console.log(updatedCompletedList);
    setCompletedTodos(updatedCompletedList);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedList));

    handleToDoDelete(index, false);
  };

  const moveTodo = (fromIndex, toIndex, isCompleted) => {
    const sourceList = isCompleted ? completedTodos : allTodos;
    const destinationList = isCompleted ? setCompletedTodos : setAllTodos;

    const updatedTodos = [...sourceList];
    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);

    destinationList(updatedTodos);

    if (isCompleted) {
      localStorage.setItem('completedTodos', JSON.stringify(updatedTodos));
    } else {
      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>React Task Tracker</h1>

        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Task:</label>
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What's the task?"
              />
            </div>
            <div className="todo-input-item">
              <label>Description:</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What's the description of your task?"
              />
            </div>
            <div className="todo-input-item">
              <button
                className="primary-btn"
                type="button"
                onClick={handleAddNewToDo}
              >
                Add
              </button>
            </div>
          </div>
          <div className="btn-area">
            <button
              className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
              onClick={() => setIsCompletedScreen(false)}
            >
              Incomplete
            </button>
            <button
              className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
              onClick={() => setIsCompletedScreen(true)}
            >
              Completed
            </button>
          </div>
          <div className="todo-list">
            {isCompletedScreen === false &&
              allTodos.map((item, index) => (
                <TodoItem
                  key={index}
                  item={item}
                  index={index}
                  onDelete={handleToDoDelete}
                  onComplete={handleComplete}
                  isCompletedScreen={isCompletedScreen}
                  moveTodo={moveTodo}
                />
              ))}
            {isCompletedScreen === true &&
              completedTodos.map((item, index) => (
                <TodoItem
                  key={index}
                  item={item}
                  index={index}
                  onDelete={handleToDoDelete}
                  isCompletedScreen={isCompletedScreen}
                  moveTodo={moveTodo}
                />
              ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;

