import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/useAuth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function EditTask() {
    const { auth } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Get task ID from URL

    useEffect(() => {
        const fetchTaskAndCategories = async () => {
            try {
                const [taskResponse, categoriesResponse] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/tasks/${id}`, {
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

                const task = taskResponse.data;
                setTitle(task.title || '');
                setDescription(task.description || '');
                setStatus(task.status || 'pending');
                setCategory(task.category_id || '');
                setCategories(categoriesResponse.data || []);
            } catch (err) {
                setError('Failed to fetch data.');
                console.log(err);
            }
        };

        fetchTaskAndCategories();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/tasks/${id}`, {
                title,
                description,
                status,
                category_id: category
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            navigate('/');
        } catch (err) {
            setError('Failed to update task.');
            console.log(err);
        }
    };

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="edit-task-container">
            <h2 className="edit-task-header">Edit Task</h2>
            <form onSubmit={handleSubmit} className="edit-task-form">
                <div className="form-group">
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Status:
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-select"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Category:
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" className="submit-button">Update Task</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}
