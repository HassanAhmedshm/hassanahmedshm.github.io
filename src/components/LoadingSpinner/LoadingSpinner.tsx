import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} role="status" aria-label="Loading">
      <div className="loading-spinner__circle"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}