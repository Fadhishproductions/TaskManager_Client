import React from 'react';
import { Card, Button } from 'react-bootstrap';
import moment from 'moment'; // To handle and format dates

const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
  const isOverdue = !task.completed && moment().isAfter(moment(task.dueDate));
  const overdueDuration = isOverdue ? moment().to(moment(task.dueDate), true) : null;

  // Determine border and background color based on task status
  const borderColor = task.completed
    ? 'border-success' // Green border for completed tasks
    : isOverdue
    ? 'border-danger border-3' // Thick red border for overdue tasks
    : 'border-warning'; // Softer border for pending tasks

  const backgroundColor = task.completed
    ? { backgroundColor: '#d4edda', color: '#155724' } // Soft green for completed
    : isOverdue
    ? { backgroundColor: '#f8d7da', color: '#721c24' } // Soft red for overdue
    : { backgroundColor: '#fff3cd', color: '#856404' }; // Soft yellow for pending

  return (
    <Card className={`mb-4 ${borderColor}`} style={backgroundColor}>
      <Card.Body>
        <Card.Title>
          {task.title}
          {isOverdue && !task.completed && (
            <span className="ms-2" style={{ color: '#721c24' }}>
              - Overdue {overdueDuration} ago
            </span>
          )}
        </Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <Card.Text>
          <strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}
        </Card.Text>
        <Card.Text>
          <strong>Due Date:</strong> {moment(task.dueDate).format('YYYY-MM-DD')}
        </Card.Text>
        <div className="d-flex">
          {!task.completed && (
            <>
            <Button
              variant="success"
              className="me-2"
              onClick={() => onComplete(task._id)}
            >
              Mark as Completed
            </Button>
          <Button
            variant="dark"
            className="me-2"
            onClick={() => onEdit(task._id)}
          >
            Edit
          </Button>
            </>
          )}
          <Button
            variant="danger"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;
