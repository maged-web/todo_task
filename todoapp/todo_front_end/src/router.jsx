import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';

const router =createBrowserRouter([
    {
        path:'/',
        element:<Tasks/>,
    },
    {
        path:'/signup',
        element:<Signup/>,
    },
    {
        path:'/login',
        element:<Login/>,
    },
    {
        path:'/create-task',
        element:<NewTask/>,
    },
    {
        path:'/edit-task/:id',
        element:<EditTask/>,
    },

])
export default router;