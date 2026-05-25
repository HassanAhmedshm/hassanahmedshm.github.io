import { Link } from 'react-router-dom';

const LifeTrack = () => {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5',
      fontFamily: 'Inter, sans-serif', padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto'
    }}>
      <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back</Link>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '2rem' }}>LifeTrack AI</h1>
      <p style={{ fontSize: '1.1rem', color: '#a1a1aa', lineHeight: 1.6 }}>
        Health dashboard with AI life coach, habit tracking, and smart insights
        powered by wearable data visualization.
      </p>
    </div>
  );
};

export default LifeTrack;
