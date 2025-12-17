import React from 'react';
import { Trophy, MapPin } from 'lucide-react';

const TournamentsPage = () => {
  const tournaments = [
    {
      id: 1,
      name: "Le Toss",
      description: "Le plus grand tournoi omnisports étudiant de France.",
      location: "CentraleSupélec",
      status: "Arrive prochainement",
      image: "https://placehold.co/600x400?text=Le+Toss"
    },
    {
      id: 2,
      name: "Les Ovalies",
      description: "Le plus grand tournoi de rugby universitaire à but solidaire.",
      location: "Beauvais",
      status: "Arrive prochainement",
      image: "https://placehold.co/600x400?text=Les+Ovalies"
    },
    {
      id: 3,
      name: "Le Teams",
      description: "Tournoi Européen des Grandes Écoles de Commerce.",
      location: "Campus Ecully",
      status: "Arrive prochainement",
      image: "https://placehold.co/600x400?text=Le+Teams"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Nos Tournois Majeurs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tournoi) => (
          <div key={tournoi.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-gray-200 relative">
              <img src={tournoi.image} alt={tournoi.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {tournoi.status}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">{tournoi.name}</h2>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">
                {tournoi.description}
              </p>
              
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {tournoi.location}
              </div>
              
              <button className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsPage;