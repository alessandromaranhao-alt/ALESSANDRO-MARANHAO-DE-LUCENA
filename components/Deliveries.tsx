import React, { useState } from 'react';
import { Package, Search, Plus, Check, Clock, Box } from 'lucide-react';
import { Delivery } from '../types';

const mockDeliveries: Delivery[] = [
  { id: '1', recipientName: 'João Silva', recipientId: '1', recipientUnit: '101', carrier: 'Amazon', type: 'Caixa', arrivedAt: '2023-10-24 10:30', status: 'waiting', trackingCode: 'AMZ-123456' },
  { id: '2', recipientName: 'Maria Santos', recipientId: '2', recipientUnit: '305', carrier: 'Correios', type: 'Envelope', arrivedAt: '2023-10-24 11:15', status: 'waiting' },
  { id: '3', recipientName: 'Carlos Oliveira', recipientId: '3', recipientUnit: '202', carrier: 'iFood', type: 'Alimentação', arrivedAt: '2023-10-24 12:00', pickedUpAt: '2023-10-24 12:10', status: 'picked_up' },
];

export const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [showForm, setShowForm] = useState(false);
  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({
    type: 'Caixa',
    carrier: '',
    recipientUnit: '',
    recipientName: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const delivery: Delivery = {
      id: crypto.randomUUID(),
      recipientId: 'mock', // In real app, look up user by unit
      recipientName: newDelivery.recipientName || 'Desconhecido',
      recipientUnit: newDelivery.recipientUnit || '',
      carrier: newDelivery.carrier || 'Outros',
      type: newDelivery.type as any,
      arrivedAt: new Date().toLocaleString(),
      status: 'waiting',
      trackingCode: newDelivery.trackingCode
    };
    
    setDeliveries([delivery, ...deliveries]);
    setShowForm(false);
    setNewDelivery({ type: 'Caixa', carrier: '', recipientUnit: '', recipientName: '' });
    alert(`Encomenda registrada! Notificação enviada para unidade ${delivery.recipientUnit} via WhatsApp.`);
  };

  const markPickedUp = (id: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id ? { ...d, status: 'picked_up', pickedUpAt: new Date().toLocaleString() } : d
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="text-blue-600" /> Gestão de Encomendas
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Nova Encomenda
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in-down">
          <h3 className="font-semibold mb-4 text-slate-700">Registrar Chegada</h3>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-slate-500">Unidade</label>
              <input required type="text" className="w-full px-3 py-2 bg-white border rounded-lg" placeholder="ex: 101" 
                value={newDelivery.recipientUnit} onChange={e => setNewDelivery({...newDelivery, recipientUnit: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Destinatário</label>
              <input required type="text" className="w-full px-3 py-2 bg-white border rounded-lg" placeholder="Nome"
                value={newDelivery.recipientName} onChange={e => setNewDelivery({...newDelivery, recipientName: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Transportadora</label>
              <input required type="text" className="w-full px-3 py-2 bg-white border rounded-lg" placeholder="ex: Amazon"
                value={newDelivery.carrier} onChange={e => setNewDelivery({...newDelivery, carrier: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Tipo</label>
              <select className="w-full px-3 py-2 bg-white border rounded-lg"
                value={newDelivery.type} onChange={e => setNewDelivery({...newDelivery, type: e.target.value as any})}>
                <option>Caixa</option>
                <option>Envelope</option>
                <option>Alimentação</option>
                <option>Outro</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Confirmar</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Unidade</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Destinatário</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Detalhes</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Chegada</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    {item.status === 'waiting' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} /> Aguardando
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} /> Entregue
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.recipientUnit}</td>
                  <td className="px-6 py-4 text-slate-600">{item.recipientName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Box size={16} className="text-slate-400" />
                      <span className="text-slate-600">{item.type} ({item.carrier})</span>
                    </div>
                    {item.trackingCode && <span className="text-xs text-slate-400">Rast: {item.trackingCode}</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.arrivedAt}</td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'waiting' && (
                      <button 
                        onClick={() => markPickedUp(item.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-300 px-3 py-1 rounded transition-colors"
                      >
                        Registrar Retirada
                      </button>
                    )}
                    {item.status === 'picked_up' && (
                      <span className="text-xs text-slate-400">Retirado em {item.pickedUpAt}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};