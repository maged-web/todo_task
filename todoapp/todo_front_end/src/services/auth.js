import axios from 'axios'


export const signUpApi=async (name,email,password,passwordConfirmation)=>
{
    try{
    const response=await axios.post('http://127.0.0.1:8000/api/register',{
        name,
        email,
        password,
        password_confirmation:passwordConfirmation
    });
    return response.data;
}catch(error)

{
    throw error.response.data
}

}

export const loginApi=async (email,password)=>
    {
        try{
        const respone=await axios.post('http://127.0.0.1:8000/api/login',{
            email,
            password,
        });
        return respone.data;
    }catch(error)
    
    {
        throw error.response.data
    }
    
    }
