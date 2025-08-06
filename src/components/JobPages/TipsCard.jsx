export default function TipsCard() {
  const tips = [
    'Be specific about responsibilities and requirements',
    'Highlight unique benefits or perks',
    'Use clear, concise language',
    'Include relevant keywords for searchability'
  ];

  return (
    <div className="mt-5 bg-indigo-50 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 m-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
              clipRule="evenodd"
            />
          </svg>
          Tips for a Great Job Post
        </h3>
        <ul className="space-y-2 text-sm text-indigo-800 mb-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 mt-1 text-indigo-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
