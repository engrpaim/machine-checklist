
export default function PasswordModal({ setPasswordModal, handlePassword, passworModal, Notification }) {
    console.log('Password Notif:', Notification);
    return (
        <div className="modal">
            <div className="modal-data-container">
                <h1>Password Edit</h1>
                <div className="password-container">
                    <labe>Enter password:</labe>
                    <input type="password" onChange={(e) => setPasswordModal(e.target.value)} onKeyDown={(e) => { e.key === 'Enter' ? handlePassword(passworModal) : null }} />
                </div>
                <div>
                    <button className="cancel-btn" onClick={(e) => setPasswordModal(false)}>CANCEL</button>
                    <button className="success-btn" onClick={(e) => handlePassword(passworModal)}>ENTER</button>
                </div>
                <div className="notification">
                    <div className={Notification && Notification.theme ? Notification.theme : null}>
                        <p>{Notification && Notification.message ? Notification.message : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
