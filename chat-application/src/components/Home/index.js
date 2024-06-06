import './home.css'
import { useNavigate } from 'react-router-dom'

const Home =()=> {
    const navigate = useNavigate();
    return(
        <div className='home-container'>
            <div className='inner-home-container'>
                <h4>Sign in to open <span>Chat Application</span> </h4>
                <button onClick={()=> navigate('/login')}>Sign in</button>
            </div>
        </div>
    )
}

export default Home