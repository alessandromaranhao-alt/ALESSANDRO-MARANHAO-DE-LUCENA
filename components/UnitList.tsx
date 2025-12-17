
import React, { useState, useMemo, useEffect } from 'react';
import { Home, User, Car, PawPrint, Package, Users, ChevronRight, Mail, Phone, Shield, Briefcase, Search, Calendar, Clock, AlertTriangle, FileText, Save, Edit3, MapPin, Plus, Trash2, X } from 'lucide-react';
import { User as UserType, UserType as UserTypeEnum, Vehicle, Pet, Delivery, Visitor } from '../types';

// Extended Mock Data for Units View - Defined outside to be initial state
const INITIAL_UNIT_RESIDENTS: UserType[] = [
  { 
    id: '1', name: 'Ana Silva', email: 'ana@email.com', phone: '(11) 99999-1111', type: UserTypeEnum.RESIDENT, unit: '101', status: 'active', registeredAt: '2023-01-15',
    validity: { start: '2023-01-15', isActive: true },
    vehicles: [
      { make: 'Honda', model: 'Civic', color: 'Prata', plate: 'ABC-1234' }
    ],
    pets: [
      { id: 'p1', name: 'Rex', type: 'Cachorro', breed: 'Golden Retriever', color: 'Dourado' }
    ]
  },
  { 
    id: '1b', name: 'Pedro Silva', email: 'pedro@email.com', phone: '(11) 99999-1112', type: UserTypeEnum.DEPENDENT, unit: '101', status: 'active', registeredAt: '2023-01-20',
    validity: { start: '2023-01-20', isActive: true },
    vehicles: [],
    pets: []
  },
  { 
    id: '2', name: 'Bruno Santos', email: 'bruno@email.com', phone: '(11) 99999-2222', type: UserTypeEnum.OWNER, unit: '102', status: 'active', registeredAt: '2023-02-20',
    validity: { start: '2023-02-20', isActive: true },
    observations: "⚠️ Ocorrência (20/10): Barulho após as 22h. Notificado.",
    vehicles: [
      { make: 'Toyota', model: 'Corolla', color: 'Preto', plate: 'XYZ-9876' },
      { make: 'Yamaha', model: 'MT-03', color: 'Azul', plate: 'MTO-5555' }
    ],
    pets: []
  },
  { 
    id: '3', name: 'Carla Dias', email: 'carla@email.com', phone: '(11) 99999-3333', type: UserTypeEnum.TENANT, unit: '201', status: 'active', registeredAt: '2023-03-10',
    validity: { start: '2023-03-10', end: '2024-03-10', isActive: true },
    vehicles: [
      { make: 'Fiat', model: 'Pulse', color: 'Branco', plate: 'FIA-2020' }
    ],
    pets: [
      { id: 'p2', name: 'Miau', type: 'Gato', breed: 'Siamês', color: 'Bege' },
      { id: 'p3', name: 'Luna', type: 'Gato', breed: 'Persa', color: 'Branco' }
    ]
  },
];

const UNIT_DELIVERIES: Delivery[] = [
  { id: 'd1', recipientName: 'Ana Silva', recipientId: '1', recipientUnit: '101', carrier: 'Amazon', type: 'Caixa', arrivedAt: 'Hoje 10:30', status: 'waiting', trackingCode: 'AMZ-123', validity: { start: 'Hoje 08:00', end: 'Hoje 18:00', isActive: true } },
  { id: 'd2', recipientName: 'Carla Dias', recipientId: '3', recipientUnit: '201', carrier: 'iFood', type: 'Alimentação', arrivedAt: 'Hoje 12:00', status: 'waiting', validity: { start: 'Hoje 11:30', end: 'Hoje 12:30', isActive: true } }
];

const UNIT_VISITORS: Visitor[] = [
  { id: 'v1', name: 'Marcos (Técnico Net)', hostId: '1', hostName: 'Ana Silva', hostUnit: '101', purpose: 'Manutenção', expectedDate: 'Hoje 14:00', status: 'scheduled', validity: { start: 'Hoje 13:00', end: 'Hoje 18:00', isActive: true } },
  { id: 'v2', name: 'Tia Joana', hostId: '3', hostName: 'Carla Dias', hostUnit: '201', purpose: 'Visita', expectedDate: 'Amanhã', status: 'scheduled', validity: { start: 'Amanhã 09:00', end: 'Amanhã 22:00', isActive: true } }
];

const UNIT_PROVIDERS: UserType[] = [
  { 
    id: 'pr1', name: 'Maria Limpeza', email: 'maria@clean.com', phone: '(11) 98888-7777', type: UserTypeEnum.SERVICE_PROVIDER, unit: '101', status: 'active', registeredAt: '2023-06-01', serviceType: 'Diarista',
    validity: { start: '2023-06-01', end: '2024-06-01', isActive: true },
    vehicles: [] 
  },
  { 
    id: 'pr2', name: 'João Jardineiro', email: 'joao@garden.com', phone: '(11) 97777-6666', type: UserTypeEnum.SERVICE_PROVIDER, unit: '201', status: 'active', registeredAt: '2023-06-15', serviceType: 'Jardineiro',
    validity: { start: '2023-06-15', end: '2023-12-15', isActive: true },
    vehicles: [{ make: 'VW', model: 'Saveiro', color: 'Branca', plate: 'SVC-9999' }]
  }
];

// Mock storage for unit observations
const UNIT_NOTES: Record<string, string> = {
  '101': 'Porta da varanda com defeito na fechadura (relatado em 15/10). Aguardando peça.',
  '102': 'Histórico de reclamações de barulho. Notificado 3x em 2023.',
  '201': 'Inquilino novo, verificar se recebeu o controle da garagem.'
};

export const UnitList: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>('101');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Residents (to allow updates)
  const [residents, setResidents] = useState<UserType[]>(INITIAL_UNIT_RESIDENTS);

  // State for Unit Observations
  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  // State for adding vehicle
  const [addingVehicleToResident, setAddingVehicleToResident] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', color: '', plate: '' });

  // Update notes when unit changes
  useEffect(() => {
    if (selectedUnit) {
      setNoteText(UNIT_NOTES[selectedUnit] || '');
      setIsEditingNote(false);
      setAddingVehicleToResident(null);
    }
  }, [selectedUnit]);

  const handleSaveNote = () => {
    if (selectedUnit) {
      UNIT_NOTES[selectedUnit] = noteText;
      setIsEditingNote(false);
    }
  };

  const handleAddVehicle = (residentId: string) => {
    if (!newVehicle.plate || !newVehicle.model) {
      alert("Placa e Modelo são obrigatórios");
      return;
    }

    setResidents(prev => prev.map(r => {
      if (r.id === residentId) {
        return {
          ...r,
          vehicles: [...(r.vehicles || []), newVehicle]
        };
      }
      return r;
    }));

    setAddingVehicleToResident(null);
    setNewVehicle({ make: '', model: '', color: '', plate: '' });
  };

  const handleRemoveVehicle = (residentId: string, plate: string) => {
    if (window.confirm("Remover este veículo?")) {
      setResidents(prev => prev.map(r => {
        if (r.id === residentId) {
          return {
            ...r,
            vehicles: r.vehicles?.filter(v => v.plate !== plate)
          };
        }
        return r;
      }));
    }
  };
  
  // Extract unique units
  const allUnits = Array.from(new Set([
    ...residents.map(u => u.unit || 'Unknown'),
    ...UNIT_PROVIDERS.map(u => u.unit || 'Unknown')
  ])).sort();

  // Helper to check if a unit matches the search term deep inside its data
  const unitMatchesSearch = (unit: string, term: string) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    
    // Check unit number
    if (unit.toLowerCase().includes(lowerTerm)) return true;

    // Check Residents (Names, Emails, Vehicles, Pets)
    const unitResidents = residents.filter(u => u.unit === unit);
    if (unitResidents.some(r => 
      r.name.toLowerCase().includes(lowerTerm) || 
      r.email.toLowerCase().includes(lowerTerm) ||
      r.vehicles?.some(v => v.plate.toLowerCase().includes(lowerTerm) || v.model.toLowerCase().includes(lowerTerm)) ||
      r.pets?.some(p => p.name.toLowerCase().includes(lowerTerm))
    )) return true;

    // Check Visitors (Names)
    const visitors = UNIT_VISITORS.filter(v => v.hostUnit === unit);
    if (visitors.some(v => v.name.toLowerCase().includes(lowerTerm))) return true;

    // Check Providers (Names, Service Types, Vehicles)
    const providers = UNIT_PROVIDERS.filter(p => p.unit === unit);
    if (providers.some(p => 
      p.name.toLowerCase().includes(lowerTerm) || 
      p.serviceType?.toLowerCase().includes(lowerTerm) ||
      p.vehicles?.some(v => v.plate.toLowerCase().includes(lowerTerm))
    )) return true;

    // Check Deliveries (Tracking, Carrier)
    const deliveries = UNIT_DELIVERIES.filter(d => d.recipientUnit === unit);
    if (deliveries.some(d => d.trackingCode?.toLowerCase().includes(lowerTerm) || d.carrier.toLowerCase().includes(lowerTerm))) return true;

    return false;
  };

  const filteredUnits = useMemo(() => {
    return allUnits.filter(unit => unitMatchesSearch(unit, searchTerm));
  }, [allUnits, searchTerm, residents]); // Added residents to dependency

  const getUnitData = (unit: string) => {
    return {
      residents: residents.filter(u => u.unit === unit || (!u.unit && unit === 'Unknown')),
      deliveries: UNIT_DELIVERIES.filter(d => d.recipientUnit === unit || (!d.recipientUnit && unit === 'Unknown')),
      visitors: UNIT_VISITORS.filter(v => v.hostUnit === unit || (!v.hostUnit && unit === 'Unknown')),
      providers: UNIT_PROVIDERS.filter(p => p.unit === unit || (!p.unit && unit === 'Unknown'))
    };
  };

  const currentData = selectedUnit ? getUnitData(selectedUnit) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* Unit Sidebar List */}
      <div className="lg:w-1/4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Home size={20} className="text-blue-600" /> Unidades
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar unidade, morador, placa..." 
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredUnits.length > 0 ? (
            filteredUnits.map(unit => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedUnit === unit 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedUnit === unit ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {unit}
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Unidade {unit}</span>
                    <span className={`text-[10px] ${selectedUnit === unit ? 'text-blue-100' : 'text-slate-400'}`}>
                      {getUnitData(unit).residents.length} Moradores
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className={selectedUnit === unit ? 'text-white' : 'text-slate-300'} />
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-slate-400 text-sm">
              Nenhuma unidade encontrada para "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Unit Detail View */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {selectedUnit && currentData ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Unidade {selectedUnit}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-slate-500">Detalhes da residência e ocupantes</p>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=Condomínio+Jardins,São+Paulo,SP`, '_blank')}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <MapPin size={12} /> Ver no Mapa
                    </button>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Shield size={12} /> Status Regular
                </span>
              </div>
            </div>

            {/* General Observations / Notes Section */}
            <div className="px-6 py-4 bg-white border-b border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Observações Gerais da Unidade
                </h3>
                {!isEditingNote ? (
                  <button 
                    onClick={() => setIsEditingNote(true)} 
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    <Edit3 size={12} /> Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setIsEditingNote(false); setNoteText(UNIT_NOTES[selectedUnit] || ''); }}
                      className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSaveNote} 
                      className="text-xs flex items-center gap-1 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition-colors font-medium"
                    >
                      <Save size={12} /> Salvar
                    </button>
                  </div>
                )}
              </div>
              
              {isEditingNote ? (
                <textarea
                  className="w-full text-sm p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none min-h-[80px] bg-blue-50/20 text-slate-700"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Adicione notas sobre incidentes, reformas ou avisos para a portaria..."
                  autoFocus
                />
              ) : (
                <div className={`text-sm p-3 rounded-lg border ${noteText ? 'bg-amber-50 border-amber-100 text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-400 italic'}`}>
                  {noteText || "Nenhuma observação registrada para esta unidade."}
                </div>
              )}
            </div>

            <div className="p-6 space-y-8">
              
              {/* Residents Section */}
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-500" /> Moradores & Dependentes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentData.residents.map(resident => (
                    <div key={resident.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                            {resident.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{resident.name}</p>
                            <p className="text-xs text-slate-500">{resident.type}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Phone size={14} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Mail size={14} /></button>
                        </div>
                      </div>

                      {/* Validity Info */}
                      {resident.validity && (
                        <div className="mb-3 flex items-center gap-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                          <Clock size={12} />
                          <span>
                            Acesso Válido: {resident.validity.start} 
                            {resident.validity.end ? ` até ${resident.validity.end}` : ' (Indeterminado)'}
                          </span>
                        </div>
                      )}

                      {/* Linked Vehicles */}
                      <div className="mt-3 pt-3 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <Car size={10} /> Veículos Vinculados
                          </p>
                          <button 
                            onClick={() => setAddingVehicleToResident(resident.id)}
                            className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Plus size={10} /> Adicionar
                          </button>
                        </div>
                        
                        {addingVehicleToResident === resident.id && (
                          <div className="bg-blue-50 p-2 rounded-lg mb-2 text-xs animate-fade-in-down">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <input placeholder="Placa (ABC-1234)" className="p-1 rounded border" value={newVehicle.plate} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})} />
                              <input placeholder="Modelo" className="p-1 rounded border" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                              <input placeholder="Marca" className="p-1 rounded border" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} />
                              <input placeholder="Cor" className="p-1 rounded border" value={newVehicle.color} onChange={e => setNewVehicle({...newVehicle, color: e.target.value})} />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleAddVehicle(resident.id)} className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Salvar</button>
                              <button onClick={() => setAddingVehicleToResident(null)} className="flex-1 bg-slate-200 text-slate-600 py-1 rounded hover:bg-slate-300">Cancelar</button>
                            </div>
                          </div>
                        )}

                        {resident.vehicles && resident.vehicles.length > 0 ? (
                          <div className="space-y-2">
                            {resident.vehicles.map((car, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg group">
                                <span className="font-medium text-slate-700">{car.make} {car.model}</span>
                                <div className="flex gap-2 items-center">
                                  <span className="text-slate-500 hidden sm:inline">{car.color}</span>
                                  <span className="font-mono bg-white px-1.5 rounded border border-slate-200">{car.plate}</span>
                                  <button 
                                    onClick={() => handleRemoveVehicle(resident.id, car.plate)}
                                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Nenhum veículo.</p>
                        )}
                      </div>

                      {/* Linked Pets */}
                      {resident.pets && resident.pets.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-50">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                            <PawPrint size={10} /> Pets
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {resident.pets.map((pet, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                <PawPrint size={10} /> {pet.name} <span className="opacity-60">({pet.type})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Observations */}
                      {resident.observations && (
                        <div className="mt-3 pt-3 border-t border-slate-50">
                           <div className="p-2 bg-red-50 border border-red-100 rounded text-xs text-red-800">
                             <p className="font-bold flex items-center gap-1 mb-1">
                               <AlertTriangle size={12} /> Observações
                             </p>
                             {resident.observations}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Service Providers Section */}
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-indigo-500" /> Prestadores de Serviço Vinculados
                </h3>
                {currentData.providers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentData.providers.map(provider => (
                      <div key={provider.id} className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                              <Briefcase size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{provider.name}</p>
                              <p className="text-xs text-slate-500">{provider.serviceType} • {provider.phone}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${provider.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                            {provider.status}
                          </span>
                        </div>
                        
                        {provider.validity && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded border border-indigo-100">
                            <Calendar size={12} className="text-indigo-400" />
                            <span>Autorização: {provider.validity.start} - {provider.validity.end}</span>
                          </div>
                        )}

                        {provider.vehicles && provider.vehicles.length > 0 && (
                          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                            <Car size={12} /> {provider.vehicles[0].model} ({provider.vehicles[0].plate})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Nenhum prestador vinculado.</p>
                )}
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Deliveries Section */}
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Package size={20} className="text-amber-500" /> Encomendas Pendentes
                  </h3>
                  {currentData.deliveries.length > 0 ? (
                    <div className="space-y-3">
                      {currentData.deliveries.map(delivery => (
                        <div key={delivery.id} className="flex flex-col gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-amber-500 shadow-sm">
                              <Package size={18} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">{delivery.type}</p>
                              <p className="text-xs text-slate-500">{delivery.carrier} • Chegou: {delivery.arrivedAt}</p>
                            </div>
                            <button className="text-xs font-medium text-amber-700 hover:underline">Notificar</button>
                          </div>
                          {delivery.validity && (
                            <div className="text-[10px] text-amber-700/70 flex items-center gap-1 pl-11">
                              <Clock size={10} /> Janela de Entrega: {delivery.validity.start} - {delivery.validity.end}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Nenhuma encomenda aguardando.</p>
                  )}
                </section>

                {/* Visitors Section */}
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-purple-500" /> Visitantes Agendados
                  </h3>
                  {currentData.visitors.length > 0 ? (
                    <div className="space-y-3">
                      {currentData.visitors.map(visitor => (
                        <div key={visitor.id} className="flex flex-col gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-purple-500 shadow-sm">
                              <Shield size={18} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">{visitor.name}</p>
                              <p className="text-xs text-slate-500">{visitor.purpose} • {visitor.expectedDate}</p>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded text-purple-700">
                              {visitor.status === 'scheduled' ? 'Agendado' : 'Na portaria'}
                            </span>
                          </div>
                          {visitor.validity && (
                            <div className="text-[10px] text-purple-700/70 flex items-center gap-1 pl-11">
                              <Clock size={10} /> Permissão: {visitor.validity.start} - {visitor.validity.end}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Nenhum visitante agendado.</p>
                  )}
                </section>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Home size={48} className="mb-4 opacity-20" />
            <p>Selecione uma unidade para ver os detalhes</p>
          </div>
        )}
      </div>
    </div>
  );
};
