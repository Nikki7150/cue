import '../styles/UserProfilePopup.css'

const UserProfilePopup = ({ user, logout }) => {
    return (
        <div className="user-popup">
            <p className="user-email">{user?.email}</p>
            <p className="user-name">{user ? user?.displayName : 'Guest'}</p>
        </div>
    );
};

export default UserProfilePopup;