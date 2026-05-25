import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'Inter, sans-serif',
      textAlign: 'center', padding: '2rem'
    }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginTop: '0.5rem' }}>This page doesn't exist</p>
      <Link to="/" style={{
        marginTop: '2rem', padding: '0.75rem 2rem', background: '#3b82f6', color: 'white',
        borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
      }}>Go Home</Link>
    </div>
  );
};

export default NotFound;
