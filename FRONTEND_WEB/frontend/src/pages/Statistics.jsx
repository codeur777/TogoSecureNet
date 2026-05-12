import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const Statistics = () => {
  const dataAlerts = [
    { name: 'Lun', alerts: 45 },
    { name: 'Mar', alerts: 52 },
    { name: 'Mer', alerts: 38 },
    { name: 'Jeu', alerts: 65 },
    { name: 'Ven', alerts: 48 },
    { name: 'Sam', alerts: 30 },
    { name: 'Dim', alerts: 25 },
  ];

  const dataGravity = [
    { name: 'Critique', value: 15, color: '#ef4444' },
    { name: 'Élevé', value: 35, color: '#f97316' },
    { name: 'Normal', value: 50, color: '#3b82f6' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytiques & Rapports</h1>
        <p className="text-gray-400 mt-1">Visualisez les performances du système et les tendances sécuritaires.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts Trend */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-lg font-bold text-white mb-8">Flux d'alertes hebdomadaire</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataAlerts}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161922', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="alerts" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAlerts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gravity Distribution */}
        <div className="glass p-8 rounded-[2rem]">
          <h3 className="text-lg font-bold text-white mb-8">Répartition par gravité</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataGravity}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {dataGravity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161922', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-white">100</span>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Alertes</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {dataGravity.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-400">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Précision IA', value: '96.4%', sub: '+1.2% ce mois', color: 'text-green-500' },
          { label: 'Temps de réponse moyen', value: '1.4s', sub: '-0.3s ce mois', color: 'text-purple-500' },
          { label: 'Taux de résolution', value: '82%', sub: '+5% ce mois', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-3xl font-bold text-white mt-2">{stat.value}</h4>
            <p className={`text-xs mt-2 font-medium ${stat.color}`}>{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
