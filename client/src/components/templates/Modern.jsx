export default function Modern({ data }) {
  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-full" data-testid="template-modern">
      <header className="bg-indigo-600 text-white px-10 py-12 mb-8 shadow-md">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">{data.personal?.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-indigo-100 font-medium text-sm">
          {data.personal?.email && <span className="bg-indigo-700 px-3 py-1 rounded-full">{data.personal.email}</span>}
          {data.personal?.phone && <span className="bg-indigo-700 px-3 py-1 rounded-full">{data.personal.phone}</span>}
          {data.personal?.location && <span className="bg-indigo-700 px-3 py-1 rounded-full">{data.personal.location}</span>}
        </div>
      </header>

      <div className="px-10 pb-10 space-y-8">
        {data.summary && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-indigo-600 rounded-full inline-block"></span>
              Profile
            </h2>
            <p className="text-gray-600 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-indigo-600 rounded-full inline-block"></span>
              Work Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-indigo-100">
                  <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-[7px] top-2"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                    <span className="text-sm font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{exp.duration}</span>
                  </div>
                  <div className="text-indigo-600 font-medium mb-3">{exp.company}</div>
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {data.education?.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                <span className="w-6 h-1 bg-indigo-600 rounded-full inline-block"></span>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                    <div className="text-indigo-600 text-sm mb-1">{edu.institution}</div>
                    <div className="text-xs font-semibold text-gray-500">{edu.duration}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills?.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
                <span className="w-6 h-1 bg-indigo-600 rounded-full inline-block"></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
