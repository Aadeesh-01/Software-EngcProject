export default function Classic({ data }) {
  return (
    <div className="p-10 font-serif text-gray-900 leading-relaxed bg-white w-full h-full" data-testid="template-classic">
      <header className="text-center border-b-2 border-gray-900 pb-6 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.personal?.fullName || 'Your Name'}</h1>
        <div className="text-sm flex justify-center gap-4 text-gray-600">
          {data.personal?.email && <span>{data.personal.email}</span>}
          {data.personal?.phone && <span>• {data.personal.phone}</span>}
          {data.personal?.location && <span>• {data.personal.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
          <p className="text-sm whitespace-pre-line">{data.summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <span className="text-sm italic">{exp.duration}</span>
                </div>
                <div className="font-semibold text-sm mb-2">{exp.company}</div>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-snug">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <div className="text-sm">{edu.institution}</div>
                </div>
                <div className="text-sm italic">{edu.duration}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
            {data.skills.map((skill, i) => (
              <span key={i}>
                {skill.name}{i < data.skills.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
