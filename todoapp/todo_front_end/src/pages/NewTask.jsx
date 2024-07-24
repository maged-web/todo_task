import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';

export default function NewTask() {
    const { auth } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setCategories(response.data);
            } catch (err) {
                console.log('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://127.0.0.1:8000/api/tasks', { title, description, status, category_id: selectedCategory }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred.';
            setError(errorMessage);
            console.log(err);
        }
    };

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="new-task-container">
            <h2 className="new-task-header">Create New Task</h2>
            <form onSubmit={handleSubmit} className="new-task-form">
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
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" className="submit-button">Create Task</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}
