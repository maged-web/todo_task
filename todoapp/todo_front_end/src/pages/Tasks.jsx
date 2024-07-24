import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import '../index.css'; 

export default function Tasks() {
    const { auth, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasksAndCategories = async () => {
            try {
                const [tasksResponse, categoriesResponse] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/tasks?page=${currentPage}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }),
                    axios.get('http://127.0.0.1:8000/api/categories', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                ]);
                setTasks(tasksResponse.data.data);
                setTotalPages(tasksResponse.data.last_page);
                setCategories(categoriesResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data.');
                setLoading(false);
            }
        };

        fetchTasksAndCategories();
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateTask = () => {
        navigate('/create-task');
    };

    const handleEditTask = (taskId) => {
        navigate(`/edit-task/${taskId}`);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            setError('Failed to delete task.');
        }
    };

    // Filter and search logic
    const filteredTasks = tasks.filter(task => {
        return (
            (filterStatus === '' || task.status === filterStatus) &&
            (filterCategory === '' || task.category_id === parseInt(filterCategory)) &&
            (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    // Sorting logic
    const sortedTasks = filteredTasks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[sortBy] > b[sortBy]) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="tasks-container">
            <h2 className="tasks-header">Tasks</h2>
            
            <button onClick={handleCreateTask} className="create-task-button">Create New Task</button>
            <button onClick={handleLogout} className="logout-button">Logout</button>

            <div className="filters">
                {error && <div className="error-message">{error}</div>}
                <label>
                    Search:
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tasks..."
                        className="form-input"
                    />
                </label>

                <label>
                    Filter by Status:
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </label>

                <label>
                    Filter by Category:
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Sort by:
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="form-select"
                    >
                        <option value="title">Title</option>
                        <option value="status">Status</option>
                        <option value="created_at">Creation Date</option>
                    </select>
                </label>

                <label>
                    Sort order:
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="form-select"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>

            <ul className="tasks-list">
                {sortedTasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <h3 className="task-title">{task.title}</h3>
                        <p className="task-description">{task.description}</p>
                        <p className="task-status">Status: {task.status}</p>
                        <p className="task-category">Category: {categories.find(cat => cat.id === task.category_id)?.name || 'N/A'}</p>
                        <button onClick={() => handleEditTask(task.id)} className="edit-task-button">Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="delete-task-button">Delete</button>
                    </li>
                ))}
            </ul>

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
                    Next
                </button>
            </div>

        </div>
    );
}
