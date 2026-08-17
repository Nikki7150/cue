import '../styles/ProgressBar.css';

const ProgressBar = ({ percent, color }) => {
    return (
        <div className="progress-bar-wrapper">
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
            </div>
            <span className="progress =-bar-label">{percent}%</span>
        </div>
    )
}

export default ProgressBar;