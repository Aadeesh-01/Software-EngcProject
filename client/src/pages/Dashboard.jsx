import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Plus, Copy, Trash2, FileText, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const createResume = async () => {
    const title = prompt('Enter resume title:');
    if (!title) return;

    try {
      const res = await fetch('http://localhost:5001/api/resumes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, template: 'classic' })
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/builder/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setResumes(resumes.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const duplicateResume = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/resumes/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchResumes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}</span>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-center text-gray-500">Loading resumes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={createResume}
            className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition"
          >
            <Plus size={48} className="mb-2" />
            <span className="font-semibold">Create New Resume</span>
          </div>

          {resumes.map(resume => (
            <div key={resume.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-64 hover:shadow-md transition">
              <div className="flex-1 p-6 flex flex-col cursor-pointer" onClick={() => navigate(`/builder/${resume.id}`)}>
                <FileText size={40} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{resume.title}</h3>
                <p className="text-sm text-gray-500">Template: {resume.template}</p>
                <p className="text-xs text-gray-400 mt-auto">
                  Updated: {new Date(resume.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="border-t border-gray-100 p-3 flex justify-end gap-2 bg-gray-50">
                <button 
                  onClick={() => duplicateResume(resume.id)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Duplicate"
                >
                  <Copy size={18} />
                </button>
                <button 
                  onClick={() => deleteResume(resume.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
