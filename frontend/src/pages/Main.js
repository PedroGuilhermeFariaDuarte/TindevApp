import React,{ useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import '../css/Main.css';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from "../assets/itsamatch.png";
import api from "../services/api";
import io from "socket.io-client";

export default function Main({match}){
    
    const [users,setUser] = useState([]);
    const [matchDev, setMachDev] = useState(null);
    useEffect(() => {
        async function loadusers(){
            const response = await api.get("/devs", {
                headers: {
                    user: match.params.idDev
                } 
            });
            
            setUser(response.data);
        }

        loadusers();
    }, [match.params.idDev]);

    useEffect(() =>{
        const socket = io('http://localhost:3333', {
            query: {
                user: match.params.idDev
            }
        });    

        socket.on('match', dev => {
            console.log(dev);
            setMachDev(dev);
        });

    },[match.params.idDev]);

    async function handleLike(id){
        const response = await api.post(`/devs/${id}/likes`,null, {
            headers: {
                user: match.params.idDev
            }
        });
        
        if (response.status === 200) {
            setUser(users.filter(user => user._id !== id));
        }        
    }

    async function handleDisLike(id) {
        const response = await api.post(`/devs/${id}/dislikes`,null, {
            headers: {
                user: match.params.idDev
            }
        });

        if(response.status === 200){
            setUser(users.filter(user => user._id !== id));
        }        
    }

    return (
        <div className="main_container">
            <Link to="/">
                <img src={logo} alt="Logo TinDev"/>
            </Link>
                {
                    users.length > 0 ? 
                    (
                        <ul>
                            {                            
                            users.map(user => (
                                <li key={user._id}>
                                    <img src={user.avatar} alt={user.name} />
                                    <footer>
                                        <strong>{user.name}</strong>
                                        <p>{user.bio}</p>
                                    </footer>
                                    <div className="buttons">
                                        <button type="button" onClick={() => { handleDisLike(user._id) }}>
                                            <img src={dislike} alt="Dislike" />
                                        </button>
                                        <button type="button" onClick={() => { handleLike(user._id) }}>
                                            <img src={like} alt="Like" />
                                        </button>
                                    </div>
                                 </li>
                            )                            
                            )}
                        </ul>
                    )
                    :
                    (
                        <div className="empty">
                            Acabou :(
                        </div>
                    )
                }

            {
                matchDev && 
                    //console.log("MATCH: " + matchDev)
                (
                    
                   <div className="match_container">
                        <img src={itsamatch} alt="It's a match"/>
                        <img src={matchDev.avatar} className="avatar" alt="avatar"/>
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>
                        <button type="button" onClick={() => { setMachDev(null)}}>Fechar</button>
                    </div> 
                )                
            }                                
        </div>
    );    
}