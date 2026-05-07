export default function Notification({message , theme}){
    return(
        <div className='notif-container' style={{ backgroundImage:theme === 'success-container' ? 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)':'linear-gradient(to top, #c71d6f 0%, #d09693 100%)' }}>
            <div className="notification-message">
                <p>{message}</p>
            </div>
        </div>
    )
}

