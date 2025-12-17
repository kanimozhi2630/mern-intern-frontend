import { useState, useEffect, useContext } from 'react';
import { progressAPI, authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
  const [formData, setFormData] = useState({
    totalClasses: '',
    attendedClasses: '',
    subject: '',
    marks: '',
    maxMarks: '',
    examType: '',
    suggestions: '',
    overallPerformance: ''
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await progressAPI.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students');
    }
  };

  const handleEditStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const { data } = await progressAPI.getStudentProgress(student._id);
      setFormData({
        totalClasses: data.attendance.totalClasses,
        attendedClasses: data.attendance.attendedClasses,
        subject: '',
        marks: '',
        maxMarks: '',
        examType: '',
        suggestions: '',
        overallPerformance: data.overallPerformance || ''
      });
    } catch (err) {
      setFormData({
        totalClasses: '',
        attendedClasses: '',
        subject: '',
        marks: '',
        maxMarks: '',
        examType: '',
        suggestions: '',
        overallPerformance: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {};
      
      if (formData.totalClasses && formData.attendedClasses) {
        updateData.attendance = {
          totalClasses: Number(formData.totalClasses),
          attendedClasses: Number(formData.attendedClasses)
        };
      }

      if (formData.subject && formData.marks && formData.maxMarks) {
        updateData.marks = [{
          subject: formData.subject,
          marks: Number(formData.marks),
          maxMarks: Number(formData.maxMarks),
          examType: formData.examType,
          date: new Date()
        }];
      }

      if (formData.suggestions) {
        updateData.suggestions = formData.suggestions;
      }

      if (formData.overallPerformance) {
        updateData.overallPerformance = formData.overallPerformance;
      }

      await progressAPI.updateStudentProgress(selectedStudent._id, updateData);
      alert('Student progress updated successfully!');
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert('Failed to update student progress');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="badge badge-success">Department: {user.department}</div>
            <button onClick={() => setShowAddModal(true)} className="btn btn-secondary">
              + Add Student
            </button>
          </div>
        </div>

        <div className="table-container">
          <h2 className="card-title">Students List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Last Logout</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    {student.lastLogin
                      ? new Date(student.lastLogin).toLocaleString()
                      : 'Never'}
                  </td>
                  <td>
                    {student.lastLogout
                      ? new Date(student.lastLogout).toLocaleString()
                      : 'Never'}
                  </td>
                  <td>
                    <span className={`badge ${student.hasProgress ? 'badge-success' : 'badge-warning'}`}>
                      {student.hasProgress ? 'Data Added' : 'No Data'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Edit Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Student</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await authAPI.createStudent(newStudent);
                  alert('Student added successfully!');
                  setShowAddModal(false);
                  setNewStudent({ name: '', email: '', password: '' });
                  fetchStudents();
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to add student');
                }
              }}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Add Student
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Update Student Progress</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: '1rem' }}>Attendance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Total Classes</label>
                    <input
                      type="number"
                      value={formData.totalClasses}
                      onChange={(e) => setFormData({ ...formData, totalClasses: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Attended Classes</label>
                    <input
                      type="number"
                      value={formData.attendedClasses}
                      onChange={(e) => setFormData({ ...formData, attendedClasses: e.target.value })}
                    />
                  </div>
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Add Marks</h3>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Marks Obtained</label>
                    <input
                      type="number"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Marks</label>
                    <input
                      type="number"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Exam Type</label>
                  <input
                    type="text"
                    placeholder="e.g., Mid-term, Final, Quiz"
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Overall Performance</label>
                  <select
                    value={formData.overallPerformance}
                    onChange={(e) => setFormData({ ...formData, overallPerformance: e.target.value })}
                  >
                    <option value="">Select Performance</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Suggestions/Feedback</label>
                  <textarea
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border)' }}
                    value={formData.suggestions}
                    onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Update Progress
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
