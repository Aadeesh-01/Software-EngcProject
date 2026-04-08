import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ResumeEditor from '../components/builder/ResumeEditor';
import Classic from '../components/templates/Classic';
import Modern from '../components/templates/Modern';
import Minimal from '../components/templates/Minimal';
import { ArrowLeft, Save, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function Builder() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(null);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/resumes/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResume(data);
        setLastSavedData(JSON.stringify(data));
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await fetch(`http://localhost:5001/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: resume.title,
          template: resume.template,
          data: resume.data
        })
      });
      setLastSavedData(JSON.stringify(resume));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setSaving(false), 500); // keep text 'Saving...' a bit
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (!resume || !lastSavedData) return;
    
    const currentDataString = JSON.stringify(resume);
    if (currentDataString === lastSavedData) return;

    const timer = setTimeout(() => {
      saveResume();
    }, 1500); // Debounce auto-save

    return () => clearTimeout(timer);
  }, [resume, lastSavedData]);

  const handleExportPDF = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 0,
      filename: `${user.name.toLowerCase().replace(/\s+/g, '-')}-${resume.template}-resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading || !resume) return <div className="p-8">Loading...</div>;

  const updateData = (newData) => {
    setResume(prev => ({ ...prev, data: newData }));
  };

  const updateTemplate = (template) => {
    setResume(prev => ({ ...prev, template }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800">
            <ArrowLeft size={20} />
          </button>
          <input 
            type="text" 
            value={resume.title}
            onChange={(e) => setResume({...resume, title: e.target.value})}
            className="text-lg font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={resume.template}
            onChange={(e) => updateTemplate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="classic">Classic Template</option>
            <option value="modern">Modern Template</option>
            <option value="minimal">Minimal Template</option>
          </select>
          
          <button 
            disabled 
            className="flex items-center gap-2 px-4 py-1.5 min-w-[100px] justify-center bg-gray-100 text-gray-500 rounded font-medium border border-gray-200"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Saved'}
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left pane: Editor */}
        <div className="w-[450px] bg-white border-r overflow-y-auto z-10 p-6 shadow-[2px_0_8px_rgba(0,0,0,0.05)]">
          <ResumeEditor data={resume.data} onChange={updateData} />
        </div>
        
        {/* Right pane: Preview */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-200 flex justify-center items-start">
          <div 
            id="resume-preview" 
            className="bg-white shadow-xl min-h-[1056px] w-[816px] origin-top shrink-0 mb-8"
          >
            {resume.template === 'classic' && <Classic data={resume.data} />}
            {resume.template === 'modern' && <Modern data={resume.data} />}
            {resume.template === 'minimal' && <Minimal data={resume.data} />}
          </div>
        </div>
      </div>
    </div>
  );
}
