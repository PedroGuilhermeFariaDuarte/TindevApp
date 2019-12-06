import React, {useState} from 'react';
import logo from '../assets/logo.svg';
import '../css/Login.css';
import api from '../services/api';
export default function Login({history}){

    const [username, setUserName] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        
        const response = await api.post("/devs",{
            username
        });

        const { _id } = response.data;
        
        history.push(`/devs/${_id}`);
    }
    
    return (            
            <div className="login_container">            
                <form onSubmit={handleSubmit}>
                    <img src={logo} alt="Login Logo" />
                    <input 
                    type="text"
                    placeholder="Digite seu usuario no GitHub"  
                    value={username}                  
                    onChange={ e => setUserName(e.target.value)}
                    />
                    <button type="submit">login</button>
                </form>
            </div>
        );    
}
