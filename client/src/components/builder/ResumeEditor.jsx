import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const SectionHeader = ({ title, isOpen, onToggle }) => (
  <button 
    onClick={onToggle}
    className="flex justify-between items-center w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition"
  >
    {title}
    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>
);

export default function ResumeEditor({ data, onChange }) {
  const [openSections, setOpenSections] = useState({ 
    personal: true, 
    summary: false, 
    experience: false, 
    education: false, 
    skills: false 
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updatePersonal = (field, value) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const updateSummary = (value) => {
    onChange({ ...data, summary: value });
  };

  const addItem = (section, defaultItem) => {
    onChange({ ...data, [section]: [...data[section], defaultItem] });
  };

  const removeItem = (section, index) => {
    onChange({ ...data, [section]: data[section].filter((_, i) => i !== index) });
  };

  const updateItem = (section, index, field, value) => {
    const newList = [...data[section]];
    newList[index] = { ...newList[index], [field]: value };
    onChange({ ...data, [section]: newList });
  };

  return (
    <div className="space-y-4 pb-20" data-testid="resume-editor">
      {/* Personal Info */}
      <div className="space-y-4">
        <SectionHeader title="Personal Information" isOpen={openSections.personal} onToggle={() => toggleSection('personal')} />
        {openSections.personal && (
          <div className="space-y-3 px-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
              <input type="text" className="w-full border p-2 rounded" value={data.personal?.fullName || ''} onChange={(e) => updatePersonal('fullName', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
              <input type="text" className="w-full border p-2 rounded" value={data.personal?.email || ''} onChange={(e) => updatePersonal('email', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phone</label>
              <input type="text" className="w-full border p-2 rounded" value={data.personal?.phone || ''} onChange={(e) => updatePersonal('phone', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Location</label>
              <input type="text" className="w-full border p-2 rounded" value={data.personal?.location || ''} onChange={(e) => updatePersonal('location', e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <SectionHeader title="Professional Summary" isOpen={openSections.summary} onToggle={() => toggleSection('summary')} />
        {openSections.summary && (
          <div className="px-2">
            <textarea 
              rows="4"
              className="w-full border p-2 rounded" 
              value={data.summary || ''} 
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="A brief summary of your professional background..."
            />
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <SectionHeader title="Work Experience" isOpen={openSections.experience} onToggle={() => toggleSection('experience')} />
        {openSections.experience && (
          <div className="space-y-4 px-2">
            {(data.experience || []).map((exp, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 relative group bg-gray-50 bg-opacity-50">
                <button 
                  onClick={() => removeItem('experience', idx)} 
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Company</label>
                    <input type="text" className="w-full border p-1.5 rounded text-sm" value={exp.company || ''} onChange={(e) => updateItem('experience', idx, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Position</label>
                    <input type="text" className="w-full border p-1.5 rounded text-sm" value={exp.position || ''} onChange={(e) => updateItem('experience', idx, 'position', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Duration</label>
                    <input type="text" className="w-full border p-1.5 rounded text-sm" placeholder="e.g. 2020 - Present" value={exp.duration || ''} onChange={(e) => updateItem('experience', idx, 'duration', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
                  <textarea rows="3" className="w-full border p-1.5 rounded text-sm" value={exp.description || ''} onChange={(e) => updateItem('experience', idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('experience', { company: '', position: '', duration: '', description: '' })}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center gap-2 text-sm font-semibold transition"
            >
              <Plus size={16} /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <SectionHeader title="Education" isOpen={openSections.education} onToggle={() => toggleSection('education')} />
        {openSections.education && (
          <div className="space-y-4 px-2">
            {(data.education || []).map((edu, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 relative group bg-gray-50 bg-opacity-50">
                <button 
                  onClick={() => removeItem('education', idx)} 
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Institution</label>
                    <input type="text" className="w-full border p-1.5 rounded text-sm" value={edu.institution || ''} onChange={(e) => updateItem('education', idx, 'institution', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Degree</label>
                    <input type="text" className="w-full border p-1.5 rounded text-sm" value={edu.degree || ''} onChange={(e) => updateItem('education', idx, 'degree', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Duration</label>
                    <input type="text" className="w-full border p-1.5 rounded text-sm" value={edu.duration || ''} onChange={(e) => updateItem('education', idx, 'duration', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('education', { institution: '', degree: '', duration: '' })}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center gap-2 text-sm font-semibold transition"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <SectionHeader title="Skills" isOpen={openSections.skills} onToggle={() => toggleSection('skills')} />
        {openSections.skills && (
          <div className="space-y-4 px-2">
            {(data.skills || []).map((skill, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  className="flex-1 border p-1.5 rounded text-sm" 
                  placeholder="e.g. JavaScript"
                  value={skill.name || ''} 
                  onChange={(e) => updateItem('skills', idx, 'name', e.target.value)} 
                />
                <button 
                  onClick={() => removeItem('skills', idx)} 
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => addItem('skills', { name: '' })}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center gap-2 text-sm font-semibold transition"
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
