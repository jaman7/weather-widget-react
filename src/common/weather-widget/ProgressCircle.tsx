const ProgressCircle: React.FC<{ title: string; progress: number; countdown: number }> = ({ title, progress, countdown }) => (
  <div className="progress">
    <span className="title">{title}</span>

    <svg viewBox="0 0 36 36" className="circular-chart">
      <path
        className="circle"
        strokeDasharray={`${progress}, 100`}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>

    <span className="countdown">{countdown}s</span>
  </div>
);

export default ProgressCircle;
