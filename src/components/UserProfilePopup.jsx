import '../styles/UserProfilePopup.css'

const UserProfilePopup = ({ user, logout }) => {
    return (
        <div className="user-popup">
            <p className="user-email">{user?.email}</p>
            <p className="user-name">{user ? user?.displayName : 'Guest'}</p>
            <button className="logout-button" onClick={logout}>Logout</button>
        </div>
    );
};

export default UserProfilePopup;