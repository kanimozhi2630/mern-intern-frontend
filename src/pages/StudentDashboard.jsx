import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';

const StudentDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await progressAPI.getMyProgress();
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

  if (!progress) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div className="card text-center">
          <h2>No Progress Data Available</h2>
          <p>Your teacher hasn't added your progress data yet.</p>
        </div>
      </div>
    );
  }

  const totalMarks = progress.marks.reduce((sum, m) => sum + m.marks, 0);
  const maxTotalMarks = progress.marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const averagePercentage = maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Progress Dashboard</h1>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <div className="card-title">Attendance</div>
            <div className="card-value">{progress.attendance.percentage}%</div>
            <div className="card-label">
              {progress.attendance.attendedClasses} / {progress.attendance.totalClasses} Classes
            </div>
          </div>

          <div className="card">
            <div className="card-title">Average Marks</div>
            <div className="card-value">{averagePercentage}%</div>
            <div className="card-label">
              {totalMarks} / {maxTotalMarks} Total Marks
            </div>
          </div>

          <div className="card">
            <div className="card-title">Overall Performance</div>
            <div className="card-value" style={{ fontSize: '1.5rem' }}>
              {progress.overallPerformance || 'Not Evaluated'}
            </div>
          </div>
        </div>

        <div className="table-container">
          <h2 className="card-title">Marks Details</h2>
          {progress.marks.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Exam Type</th>
                  <th>Marks</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {progress.marks.map((mark, idx) => (
                  <tr key={idx}>
                    <td>{mark.subject}</td>
                    <td>{mark.examType}</td>
                    <td>{mark.marks}</td>
                    <td>{mark.maxMarks}</td>
                    <td>{((mark.marks / mark.maxMarks) * 100).toFixed(2)}%</td>
                    <td>{new Date(mark.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No marks data available</p>
          )}
        </div>

        <div className="table-container" style={{ marginTop: '1.5rem' }}>
          <h2 className="card-title">Suggestions & Feedback</h2>
          {progress.suggestions.length > 0 ? (
            <div>
              {progress.suggestions.map((suggestion, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '1rem' }}>
                  <p>{suggestion.message}</p>
                  <small className="card-label">
                    {new Date(suggestion.date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p>No suggestions available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
