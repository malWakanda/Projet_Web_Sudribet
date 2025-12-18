import React from 'react';

const MatchesPage = () => {
  // Exemple de données pour toute l'année
  const matches = [
    { id: 1, date: "15 Oct 2023", sport: "Rugby", teamA: "Les Lions", teamB: "Les Requins", time: "14:00", location: "Stade A" },
    { id: 2, date: "18 Oct 2023", sport: "Football", teamA: "FC Campus", teamB: "Polytech", time: "18:30", location: "Terrain 2" },
    { id: 3, date: "22 Oct 2023", sport: "Basket", teamA: "Dunkers", teamB: "IUT Basket", time: "20:00", location: "Gymnase B" },
    { id: 4, date: "05 Nov 2023", sport: "Volley", teamA: "Spikers", teamB: "Net Masters", time: "19:00", location: "Gymnase A" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Calendrier des Matchs</h1>
        <div className="text-sm text-gray-500">Saison 2025-2026</div>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition-colors">
            
            {/* Date et Sport */}
            <div className="flex flex-col items-center md:items-start w-full md:w-1/4 mb-4 md:mb-0">
              <span className="font-bold text-gray-900">{match.date}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{match.sport}</span>
            </div>

            {/* Équipes */}
            <div className="flex items-center justify-center w-full md:w-2/4 gap-4 mb-4 md:mb-0">
              <span className="font-semibold text-right w-1/3">{match.teamA}</span>
              <span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-700">VS</span>
              <span className="font-semibold text-left w-1/3">{match.teamB}</span>
            </div>

            {/* Heure et Lieu */}
            <div className="flex flex-col items-center md:items-end w-full md:w-1/4">
              <span className="text-blue-600 font-bold">{match.time}</span>
              <span className="text-xs text-gray-500">{match.location}</span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;