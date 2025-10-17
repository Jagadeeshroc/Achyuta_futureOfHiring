import {Link} from 'react-router-dom'

const Feedback=()=>{
    return(
        <>
        
        <div className="feedback-container">
            <button className='bg-blue-50 p-2 m-2 ' ><Link to='/myProfile'><span className='text-2xl no-underline!'>back</span></Link></button>
            <div className="feedback-header">
                <h1>Feedback</h1>
    
            <p>Your feedback is very important to us. Help us improve our services and products.</p>
        </div>
        </div>
        </>
    )
}

export default Feedback;