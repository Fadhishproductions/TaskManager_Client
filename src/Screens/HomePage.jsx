import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Modal, Form, Card } from 'react-bootstrap';
import TaskCard from '../Components/TaskCard'; // Adjust the import path as needed
import ConfirmationModal from '../Components/ConfrimationModal';
import { io } from 'socket.io-client';
import { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useDeleteTaskMutation, 
  useEditTaskMutation, 
  useMarkTaskCompletedMutation 
} from '../slices/apiSlice';
import { useSelector } from 'react-redux';
console.log('process.env.REACT_APP_SOCKETURL',process.env)
const socket = io('http://localhost:4000', {
  withCredentials: true,
});

const hasChanges = (originalTask, updatedTask) => {
  if (!originalTask || !updatedTask) return false;

  return (
    (originalTask.title?.trim() || '') !== (updatedTask.title?.trim() || '') ||
    (originalTask.description?.trim() || '') !== (updatedTask.description?.trim() || '') ||
    originalTask.dueDate !== updatedTask.dueDate
  );
};

const 
HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState('all');
  const { data: fetchedTasks = [], error, isLoading } = useGetTasksQuery(filter === 'all' ? '' : filter);
  const [tasks, setTasks] = useState([]); // Add this line
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [editTask] = useEditTaskMutation();
  const [markTaskCompleted] = useMarkTaskCompletedMutation();
  
  const [socketId, setSocketId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editTaskData, setEditTaskData] = useState({ title: '', description: '', dueDate: '' });
  const [actionType, setActionType] = useState('');
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);

  useEffect(() => {
    if(fetchedTasks){
      setTasks(fetchedTasks);
    }
     // Initialize tasks with data from the query
  }, [fetchedTasks]);

 
  useEffect(() => {

    socket.on('connect', () => {
      setSocketId(socket.id); // Save the current socket ID
      socket.emit('joinRoom', userInfo._id);
    });

    socket.on('taskCreated', (task) => {
      // Check if the event is from the current tab or another tab
      if (task.socketId !== socketId) {
        setTasks((prevTasks) => [...prevTasks, task]);
      }
    });

    socket.on('taskUpdated', (updatedTask) => {
      if (updatedTask.socketId !== socketId) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    });

    socket.on('taskCompleted', (completedTask) => {
      if (completedTask.socketId !== socketId) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === completedTask._id ? { ...task, completed: true } : task
          )
        );
      }
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.off('taskCompleted');
     };
  }, [ socketId, userInfo]);

  

  const handleCreateModalClose = () =>{ 
    setShowCreateModal(false)
    setNewTask({ title: '', description: '', dueDate: '' })
    
  };
  const handleCreateModalShow = () => setShowCreateModal(true);
  const handleEditModalClose = () => setShowEditModal(false);
  const handleEditModalShow = (task) => {
    setEditTaskData(task);
    setCurrentTask(task);
    setShowEditModal(true);
  };

  const handleCreateTask = async () => {
    try {
     await createTask(newTask).unwrap();

      // setTasks((prevTasks) => [...prevTasks, response]); // Add the new task to state
      setShowCreateConfirmation(false); // Close confirmation modal
      setShowCreateModal(false); // Close create modal
      setNewTask({ title: '', description: '', dueDate: '' });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setShowCreateConfirmation(true); // Show confirmation modal
  };

  const handleDeleteTask = (taskId) => {
    setCurrentTask(taskId);
    setActionType('delete');
    setShowConfirmationModal(true);
  };

  const handleMarkComplete = (taskId) => {
    setCurrentTask(taskId);
    setActionType('mark as complete');
    setShowConfirmationModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (actionType === 'mark as complete') {
        const response = await markTaskCompleted(currentTask).unwrap();
        console.log('res',response)
        // setTasks((prevTasks) =>
        //   prevTasks.map((task) =>
        //     task._id === response.task._id ? { ...task, completed: true } : task
        //   )
        // );
      } else if (actionType === 'delete') {
        await deleteTask(currentTask).unwrap();
        // setTasks((prevTasks) => prevTasks.filter((task) => task._id !== currentTask));
      } else if (actionType === 'edit') {
        console.log(currentTask)
        await editTask({ taskId: currentTask._id, taskData: editTaskData }).unwrap();
        // setTasks((prevTasks) =>
        //   prevTasks.map((task) => (task._id === currentTask._id ? { ...editTaskData } : task))
        // );
      }
    } catch (error) {
      console.error(`Failed to ${actionType} task:`, error);
    }
    setShowConfirmationModal(false);
    setShowEditModal(false);
    setCurrentTask(null);
  };

  useEffect(() => {
    setIsApplyDisabled(!hasChanges(currentTask, editTaskData));
  }, [editTaskData, currentTask]);

  return (
    <Container className="mt-4">
      <h1>Welcome to the Task Management App</h1>
      <p>In here, you can manage your tasks, track their status, and stay organized!</p>

      <Row className="mb-4">
        <Col className="d-flex justify-content-between">
          <ButtonGroup>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'completed' ? 'success' : 'outline-success'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'pending' ? 'warning' : 'outline-warning'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
          </ButtonGroup>
          <Button variant="info" onClick={handleCreateModalShow} className="text-white">
            Create Task
          </Button>
        </Col>
      </Row>

      {/* Create Task Modal */}
      <Modal show={showCreateModal} onHide={handleCreateModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Create Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showCreateConfirmation}
        handleClose={() => setShowCreateConfirmation(false)}
        handleConfirm={handleCreateTask}
        title="Confirm Task Creation"
        message="Are you sure you want to create this task?"
      />

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f0f8ff', borderBottom: 'none' }}>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f7fafc' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Edit task title"
                value={editTaskData.title}
                onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Edit task description"
                value={editTaskData.description}
                onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={editTaskData.dueDate}
                onChange={(e) => setEditTaskData({ ...editTaskData, dueDate: e.target.value })}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => {
                setActionType('edit');
                setShowConfirmationModal(true);
              }}
              disabled={isApplyDisabled}
              className="w-100"
            >
              Apply Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmationModal}
        handleClose={() => setShowConfirmationModal(false)}
        handleConfirm={handleConfirmAction}
        title={`Confirm ${actionType}`}
        message={`Are you sure you want to ${actionType} this task?`}
      />

      <h2 className="mt-3">Your Tasks</h2>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error fetching tasks: {error.message}</p>
      ) : (
        <Row>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Col key={task._id} md={4}>
                <TaskCard
                  task={task}
                  onEdit={() => handleEditModalShow(task)}
                  onDelete={() => handleDeleteTask(task._id)}
                  onComplete={() => handleMarkComplete(task._id)}
                />
              </Col>
            ))
          ) : (
            <Col>
              <Card className="text-center border-primary mb-3" style={{ backgroundColor: '#f0f8ff' }}>
                <Card.Body>
                  <Card.Text>{filter === 'all' ? 
                      'No tasks found. Create your first task to get started!' : 
                      'No tasks match the selected filter.'
                    }</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
