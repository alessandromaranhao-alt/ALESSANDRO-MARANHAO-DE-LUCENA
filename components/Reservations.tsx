import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Resource, Reservation } from '../types';

const resources: Resource[] = [
  { id: '1', name: 'Salão de Festas', capacity: 50, openTime: '10:00', closeTime: '23:00' },
  { id: '2', name: 'Churrasqueira A', capacity: 15, openTime: '10:00', closeTime: '22:00' },
  { id: '3', name: 'Academia (Hora Marcada)', capacity: 5, openTime: '06:00', closeTime: '23:00' },
];

const mockReservations: Reservation[] = [
  { id: '1', resourceId: '1', resourceName: 'Salão de Festas', userId: 'user1', userName: 'Ana Silva (101)', date: '2023-10-25', startTime: '18:00', endTime: '23:00', status: 'confirmed' },
  { id: '2', resourceId: '2', resourceName: 'Churrasqueira A', userId: 'user2', userName: 'Marcos (202)', date: '2023-10-26', startTime: '12:00', endTime: '16:00', status: 'pending' },
];

export const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [selectedResource, setSelectedResource] = useState(resources[0].id);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const resource = resources.find(r => r.id === selectedResource);
    if (!resource) return;

    const newRes: Reservation = {
      id: crypto.randomUUID(),
      resourceId: resource.id,
      resourceName: resource.name,
      userId: 'current',
      userName: 'Usuário Admin (Teste)',
      date,
      startTime,
      endTime,
      status: 'confirmed'
    };

    setReservations([...reservations, newRes]);
    alert("Reserva confirmada com sucesso!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} /> Nova Reserva
          </h3>
          
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Área Comum</label>
              <select 
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
              >
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                <input 
                  type="time" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
                <input 
                  type="time" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Reservar Horário
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h4 className="font-medium text-slate-800 mb-2">Regras de Uso</h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>Limpeza é responsabilidade do morador.</li>
            <li>Cancelamento gratuito até 24h antes.</li>
            <li>Multa de R$ 50,00 para danos.</li>
            <li>Respeite o horário de silêncio (22h).</li>
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Próximas Reservas</h3>
          
          <div className="space-y-4">
            {reservations.length === 0 && <p className="text-slate-500 text-center py-8">Nenhuma reserva encontrada.</p>}
            
            {reservations.map((res) => (
              <div key={res.id} className="flex items-start p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 bg-blue-50 text-blue-600 p-3 rounded-lg mr-4">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-800">{res.resourceName}</h4>
                      <p className="text-sm text-slate-500">Reservado por: {res.userName}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      res.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {res.status === 'confirmed' ? 'Confirmado' : res.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {res.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> {res.startTime} - {res.endTime}
                    </div>
                  </div>
                </div>
                
                {res.status === 'pending' && (
                  <div className="ml-4 flex flex-col gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Aprovar">
                      <CheckCircle size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Rejeitar">
                      <XCircle size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};