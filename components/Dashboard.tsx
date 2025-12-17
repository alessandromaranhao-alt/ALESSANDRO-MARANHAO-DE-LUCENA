
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShieldAlert, DoorOpen, Activity, Clock, Download, Package, Server, Wifi, Battery, LogIn, LogOut } from 'lucide-react';
import { SystemMetrics, AccessLog, HardwareStatus } from '../types';

interface DashboardProps {
  metrics: SystemMetrics;
  logs: AccessLog[];
}

const data = [
  { name: '06:00', moradores: 4, visitantes: 20 },
  { name: '09:00', moradores: 15, visitantes: 45 },
  { name: '12:00', moradores: 35, visitantes: 30 },
  { name: '15:00', moradores: 28, visitantes: 25 },
  { name: '18:00', moradores: 10, visitantes: 60 },
  { name: '21:00', moradores: 5, visitantes: 40 },
];

const mockHardware: HardwareStatus[] = [
  { id: '1', name: 'Câmera Portão Principal', type: 'Camera', status: 'online', lastPing: '10s atrás' },
  { id: '2', name: 'Câmera Garagem S1', type: 'Camera', status: 'online', lastPing: '12s atrás' },
  { id: '3', name: 'Controladora Bio-01', type: 'Controller', status: 'online', lastPing: '1s atrás', battery: 98 },
  { id: '4', name: 'Sensor Muro Fundos', type: 'Sensor', status: 'warning', lastPing: '5min atrás', battery: 15 },
];

export const Dashboard: React.FC<DashboardProps> = ({ metrics, logs }) => {
  const handleExport = () => {
    alert("Iniciando download do relatório CSV...");
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
               <Users size={24} />
             </div>
             <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{metrics.totalUsers}</h3>
          <p className="text-sm font-medium text-slate-500">Total de Usuários</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
              <Package size={24} />
            </div>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Pendentes</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{metrics.pendingDeliveries}</h3>
          <p className="text-sm font-medium text-slate-500">Encomendas</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <DoorOpen size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{metrics.dailyAccesses}</h3>
          <p className="text-sm font-medium text-slate-500">Acessos Diários</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <ShieldAlert size={24} />
            </div>
            {metrics.securityAlerts > 0 && <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>}
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{metrics.securityAlerts}</h3>
          <p className="text-sm font-medium text-slate-500">Alertas de Segurança</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={20} className="text-blue-500" />
                  Visão Geral do Tráfego
                </h3>
                <p className="text-sm text-slate-400 mt-1">Comparativo de acessos nas últimas 24h</p>
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <Download size={16} />
                Exportar CSV
              </button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoradores" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitantes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="moradores" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoradores)" name="Moradores" />
                  <Area type="monotone" dataKey="visitantes" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitantes)" name="Visitantes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hardware Status */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Server size={20} className="text-slate-500" />
              Status dos Dispositivos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockHardware.map(hw => (
                <div key={hw.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${hw.status === 'online' ? 'bg-green-500' : hw.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      {hw.status === 'warning' && <div className="absolute inset-0 w-3 h-3 bg-yellow-500 rounded-full animate-ping opacity-75"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{hw.name}</p>
                      <p className="text-xs text-slate-500">{hw.type} • {hw.lastPing}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    {hw.battery !== undefined && (
                      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-white border border-slate-200 ${hw.battery < 20 ? 'text-red-500 border-red-100 bg-red-50' : ''}`}>
                        <Battery size={14} /> {hw.battery}%
                      </div>
                    )}
                    <Wifi size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Registros Recentes
            </h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Ver todos</button>
          </div>
          
          <div className="space-y-1 relative">
             <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100"></div>
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors relative group">
                <div className={`w-2.5 h-2.5 mt-2 rounded-full border-2 border-white shadow-sm z-10 ${
                   log.status === 'Permitido' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{log.userName}</p>
                      {log.direction && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${log.direction === 'entry' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {log.direction === 'entry' ? 'ENT' : 'SAÍ'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-xs text-slate-500">{log.userType} • {log.method}</p>
                    {log.direction === 'entry' ? (
                      <LogIn size={12} className="text-green-400" />
                    ) : (
                      <LogOut size={12} className="text-orange-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Ver Relatório Completo
          </button>
        </div>
      </div>
    </div>
  );
};
