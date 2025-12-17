import React, { useState } from 'react';

const RankingsPage = () => {
  const [activeTab, setActiveTab] = useState('football');

  // Données fictives de classement
  const rankingsData = {
    football: [
      { rank: 1, team: "FC Campus", points: 15, played: 5, won: 5, lost: 0 },
      { rank: 2, team: "Polytech", points: 12, played: 5, won: 4, lost: 1 },
      { rank: 3, team: "Les Aigles", points: 9, played: 5, won: 3, lost: 2 },
    ],
    rugby: [
      { rank: 1, team: "Les Ovales", points: 20, played: 4, won: 4, lost: 0 },
      { rank: 2, team: "XV de France", points: 15, played: 4, won: 3, lost: 1 },
    ],
    basket: [
      { rank: 1, team: "Dunkers", points: 18, played: 6, won: 6, lost: 0 },
      { rank: 2, team: "IUT Basket", points: 14, played: 6, won: 4, lost: 2 },
    ]
  };

  const sports = [
    { id: 'football', label: 'Football' },
    { id: 'rugby', label: 'Rugby' },
    { id: 'basket', label: 'Basket' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Classements par Équipe</h1>

      {/* Onglets de navigation par sport */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setActiveTab(sport.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === sport.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {sport.label}
          </button>
        ))}
      </div>

      {/* Tableau de classement */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rang</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Équipe</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">MJ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">V</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">D</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rankingsData[activeTab]?.map((row) => (
                <tr key={row.team} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      row.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                      row.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                      row.rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-gray-500'
                    }`}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.team}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{row.played}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-medium">{row.won}</td>
                  <td className="px-6 py-4 text-center text-red-500">{row.lost}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;