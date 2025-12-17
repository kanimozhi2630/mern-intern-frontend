import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Student Progress Tracker</h1>
          <p>Track, Monitor, and Improve Student Performance</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
              Register Now
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'transparent' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Amazing Features</h2>
          <div className="dashboard-grid">
            <div className="card" style={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 className="card-title" style={{ background: 'linear-gradient(45deg, #2563eb, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Track Progress</h3>
              <p>Monitor student attendance, marks, and overall performance in real-time with beautiful dashboards.</p>
            </div>
            <div className="card" style={{ animation: 'fadeInUp 0.6s ease 0.2s both' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨🎓</div>
              <h3 className="card-title" style={{ background: 'linear-gradient(45deg, #0ea5e9, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Student Dashboard</h3>
              <p>Students can view their progress, attendance summary, and receive personalized suggestions.</p>
            </div>
            <div className="card" style={{ animation: 'fadeInUp 0.6s ease 0.3s both' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨🏫</div>
              <h3 className="card-title" style={{ background: 'linear-gradient(45deg, #38bdf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Teacher Dashboard</h3>
              <p>Teachers can manage student data, update progress, and track activity logs effortlessly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
