export default function Minimal({ data }) {
  return (
    <div className="flex min-h-full font-sans text-gray-800" data-testid="template-minimal">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 text-gray-300 p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-light text-white mb-6 leading-tight">{data.personal?.fullName || 'Your Name'}</h1>
          <div className="space-y-3 text-sm">
            {data.personal?.email && <div className="flex flex-col"><span className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Email</span><span className="text-white">{data.personal.email}</span></div>}
            {data.personal?.phone && <div className="flex flex-col mt-4"><span className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Phone</span><span className="text-white">{data.personal.phone}</span></div>}
            {data.personal?.location && <div className="flex flex-col mt-4"><span className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Location</span><span className="text-white">{data.personal.location}</span></div>}
          </div>
        </div>

        {data.skills?.length > 0 && (
          <div>
            <h2 className="text-white uppercase text-sm font-bold tracking-widest mb-4 border-b border-gray-700 pb-2">Skills</h2>
            <ul className="space-y-2 text-sm">
              {data.skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2" data-testid={`skill-chip-${i}`}>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.education?.length > 0 && (
          <div>
            <h2 className="text-white uppercase text-sm font-bold tracking-widest mb-4 border-b border-gray-700 pb-2">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="text-white font-semibold text-sm mb-1">{edu.degree}</h3>
                  <div className="text-xs text-gray-400 mb-1">{edu.institution}</div>
                  <div className="text-xs text-gray-500 italic">{edu.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 bg-white p-10 space-y-10">
        {data.summary && (
          <section>
            <h2 className="text-gray-900 uppercase text-lg font-bold tracking-widest mb-4">Profile</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-gray-900 uppercase text-lg font-bold tracking-widest mb-6">Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                    <span className="text-sm font-medium text-gray-500">{exp.duration}</span>
                  </div>
                  <div className="text-gray-600 uppercase text-xs font-bold tracking-wider mb-3">{exp.company}</div>
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
