import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowRight, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import './DailyOrganizer.css';

class DailyOrganizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTask: '',
      taskType: 'dailyTasks',
      tasks: [],
      idCounter: 0,
      dailyTasksTitle: 'Tareas del día',
      fixedRoutinesTitle: 'Rutinas fijas',
    };
  }

  componentDidMount() {
    this.loadTasks();
    const dailyTasksTitle = localStorage.getItem('dailyTasksTitle') || 'Tareas del día';
    const fixedRoutinesTitle = localStorage.getItem('fixedRoutinesTitle') || 'Rutinas fijas';
    this.setState({ dailyTasksTitle, fixedRoutinesTitle });
  }

  handleTitleChange = (e, titleType) => {
    this.setState({ [titleType]: e.target.value }, () => {
      localStorage.setItem(titleType, this.state[titleType]);
    });
  };

  loadTasks = () => {
    fetch('http://localhost:3000/tasks')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ tasks: data });
      })
      .catch((error) => {
        console.error('Error al cargar las tareas:', error);
      });
  };

  addTask = () => {
    const { newTask, taskType, idCounter } = this.state;
    if (newTask.trim() !== '') {
      fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTask,
          type: taskType,
          isCompleted: false,
          isEditable: false,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, data],
          idCounter: idCounter + 1,
          newTask: '',
        }));
      })
      .catch((error) => {
        console.error('Error al agregar la tarea:', error);
      });
    }
  };


  moveTask = (id, newType) => {
    const updatedTasks = this.state.tasks.map(task =>
      task.id === id ? { ...task, type: newType } : task
    );
    this.setState({ tasks: updatedTasks });
  };

  editTask = (id) => {
    const updatedTasks = this.state.tasks.map(task =>
      task.id === id ? { ...task, isEditable: !task.isEditable } : task
    );
    this.setState({ tasks: updatedTasks });
  };

  handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      this.editTask(id);
    }
  };
  
  deleteTask = (id) => {
    const updatedTasks = this.state.tasks.filter(task => task.id !== id);
    this.setState({ tasks: updatedTasks });
  };
  
  toggleCompletion = (id) => {
    const updatedTasks = this.state.tasks.map(task =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    this.setState({ tasks: updatedTasks });
  };

  updateTaskText = (e, id) => {
    const updatedTasks = this.state.tasks.map(task =>
      task.id === id ? { ...task, text: e.target.value } : task
    );
    this.setState({ tasks: updatedTasks });
  };

  render() {
    const { newTask, taskType, tasks, dailyTasksTitle, fixedRoutinesTitle }= this.state;


    return (
      <div className="container">
        <div className="task-input">
          <input
            type="text"
            placeholder="Agregar nueva tarea"
            value={newTask}
            onChange={(e) => this.setState({ newTask: e.target.value })}
          />
          <select onChange={(e) => this.setState({ taskType: e.target.value })} value={taskType}>
            <option value="dailyTasks"> 1</option>
            <option value="fixedRoutines">2</option>
          </select>
          <button onClick={this.addTask}>Adicionar</button>
        </div>
        <div className="task-columns">
          <div className="task-list">
            <input
              type="text"
              value={dailyTasksTitle}
              onChange={(e) => this.handleTitleChange(e, 'dailyTasksTitle')}
            />
            {tasks.filter((task) => task.type === 'dailyTasks').map((task) => (
              <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                {task.isEditable ? (
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => this.updateTaskText(e, task.id)}
                    onKeyPress={(e) => this.handleKeyPress(e, task.id)}
                  />
                ) : (
                  <span onClick={() => this.toggleCompletion(task.id)}>{task.text}</span>
                )}
                <div className="task-icons">
                  <FontAwesomeIcon icon={faEdit} onClick={() => this.editTask(task.id)} />
                  <FontAwesomeIcon icon={faArrowRight} onClick={() => this.moveTask(task.id, 'fixedRoutines')} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => this.deleteTask(task.id)} />
                </div>
              </div>
            ))}
          </div>
           <div className="task-list">
            <input
              type="text"
              value={fixedRoutinesTitle}
              onChange={(e) => this.handleTitleChange(e, 'fixedRoutinesTitle')}
            />
            {tasks.filter((task) => task.type === 'fixedRoutines').map((task) => (
              <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                {task.isEditable ? (
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => this.updateTaskText(e, task.id)}
                    onKeyPress={(e) => this.handleKeyPress(e, task.id)}
                  />
                ) : (
                  <span onClick={() => this.toggleCompletion(task.id)}>{task.text}</span>
                )}
                <div className="task-icons">
                  <FontAwesomeIcon icon={faEdit} onClick={() => this.editTask(task.id)} />
                  <FontAwesomeIcon icon={faArrowLeft} onClick={() => this.moveTask(task.id, 'dailyTasks')} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => this.deleteTask(task.id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default DailyOrganizer;
