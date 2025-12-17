
import React, { useState } from 'react';
import { QrCode, Mail, Copy, Check, Send, Clock, UserCheck, Loader2, AlertCircle, Car, User, Sparkles, MessageSquare, Smartphone, XCircle } from 'lucide-react';
import { generateDynamicQRToken } from '../services/qrService';
import { generateWritingSuggestion } from '../services/geminiService';

export const VisitorManagement: React.FC = () => {
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  
  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [unit, setUnit] = useState('');
  const [duration, setDuration] = useState('4');
  const [visitorType, setVisitorType] = useState('Visitante');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  // UX State
  const [authMethod, setAuthMethod] = useState<'qr_instant' | 'email_request' | 'whatsapp_request' | 'sms_request'>('qr_instant');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent' | 'approved' | 'rejected'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!visitorName.trim()) newErrors.visitorName = 'Nome é obrigatório';
    if (!unit.trim()) newErrors.unit = 'Unidade é obrigatória';
    
    if (authMethod === 'email_request' && !hostEmail.trim()) {
      newErrors.hostEmail = 'Email do anfitrião é obrigatório';
    }
    
    if ((authMethod === 'whatsapp_request' || authMethod === 'sms_request') && !hostPhone.trim()) {
      newErrors.hostPhone = 'Celular do anfitrião é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (authMethod !== 'qr_instant') {
      setRequestStatus('sending');
      // Simulate API call to send notification
      setTimeout(() => {
        setRequestStatus('sent');
      }, 1500);
    } else {
      generateQRCode();
    }
  };

  const generateQRCode = () => {
    const hours = parseInt(duration);
    const token = generateDynamicQRToken(
      crypto.randomUUID(), 
      visitorName || 'Visitante', 
      'visitor', 
      hours, 
      unit
    );
    setQrToken(token);
    setGeneratedQR(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${token}`);
  };

  const simulateHostApproval = () => {
    setRequestStatus('sending');
    setTimeout(() => {
      setRequestStatus('approved');
      generateQRCode();
    }, 1000);
  };

  const simulateHostRejection = () => {
    setRequestStatus('sending');
    setTimeout(() => {
      setRequestStatus('rejected');
    }, 1000);
  };

  const handleCopyToken = () => {
    if (qrToken) {
      navigator.clipboard.writeText(qrToken);
      alert("Token copiado para a área de transferência! (Use na aba Controle de Acesso para testar)");
    }
  };

  const handleAiSuggestion = async () => {
    if (!visitorName) {
      alert("Preencha o nome do visitante primeiro.");
      return;
    }
    setIsGeneratingText(true);
    const context = `Convidar ${visitorName} para visitar a unidade ${unit || '[Unidade]'} com duração de ${duration} horas.`;
    const tone = authMethod === 'email_request' ? 'formal' : 'friendly';
    const suggestion = await generateWritingSuggestion(context, tone);
    setCustomMessage(suggestion);
    setIsGeneratingText(false);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getMethodIcon = () => {
    switch (authMethod) {
      case 'email_request': return <Mail size={48} className="text-purple-300" />;
      case 'whatsapp_request': return <MessageSquare size={48} className="text-green-300" />;
      case 'sms_request': return <Smartphone size={48} className="text-blue-300" />;
      default: return <QrCode size={48} className="text-slate-300" />;
    }
  };

  const getMethodColor = () => {
    switch (authMethod) {
      case 'email_request': return 'purple';
      case 'whatsapp_request': return 'green';
      case 'sms_request': return 'blue';
      default: return 'slate';
    }
  };

  const resetRequest = () => {
    setRequestStatus('idle');
    setGeneratedQR(null);
    setErrors({});
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <form onSubmit={handleGenerate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-blue-600" size={24} /> Novo Acesso de Visitante
          </h3>
          <p className="text-slate-500 mt-1">Gere credenciais temporárias ou solicite autorização.</p>
        </div>
        
        <div className="space-y-6">
          {/* Method Selector */}
          <div className="bg-slate-50 p-1.5 rounded-xl flex gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => { setAuthMethod('qr_instant'); resetRequest(); }}
              className={`flex-1 py-3 px-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMethod === 'qr_instant' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <QrCode size={16} /> Instantâneo
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('email_request'); resetRequest(); }}
              className={`flex-1 py-3 px-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMethod === 'email_request' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Mail size={16} /> Email
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('whatsapp_request'); resetRequest(); }}
              className={`flex-1 py-3 px-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMethod === 'whatsapp_request' ? 'bg-white text-green-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MessageSquare size={16} /> WhatsApp
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('sms_request'); resetRequest(); }}
              className={`flex-1 py-3 px-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMethod === 'sms_request' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Smartphone size={16} /> SMS
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Visitante <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={visitorName}
                onChange={(e) => { setVisitorName(e.target.value); clearError('visitorName'); }}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none transition-all ${errors.visitorName ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                placeholder="Nome completo do convidado" 
              />
              {errors.visitorName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.visitorName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
              <select 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                value={visitorType}
                onChange={(e) => setVisitorType(e.target.value)}
              >
                <option value="Visitante">Visitante</option>
                <option value="Prestador de Serviço">Prestador</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Unidade <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={unit}
                onChange={(e) => { setUnit(e.target.value); clearError('unit'); }}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none transition-all ${errors.unit ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                placeholder="ex: 101" 
              />
              {errors.unit && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.unit}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duração do Acesso</label>
              <div className="grid grid-cols-4 gap-2">
                {['4', '12', '24', '0.5'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDuration(val)}
                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                      duration === val 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {val === '0.5' ? '30m' : `${val}h`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced / Vehicle Section */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-4">
              <Car size={16} className="text-slate-400" /> Detalhes do Veículo (Opcional)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase" 
                placeholder="Placa" 
              />
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                placeholder="Modelo/Cor" 
              />
            </div>
          </div>

          {/* Dynamic Authorization Fields */}
          <div className={`space-y-4 pt-4 border-t border-slate-100 transition-all duration-300 ${authMethod !== 'qr_instant' ? 'block' : 'hidden'}`}>
            
            {authMethod === 'email_request' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email do Anfitrião <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={hostEmail}
                  onChange={(e) => { setHostEmail(e.target.value); clearError('hostEmail'); }}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none ${errors.hostEmail ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                  placeholder="email@condominio.com" 
                />
              </div>
            )}

            {(authMethod === 'whatsapp_request' || authMethod === 'sms_request') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Celular do Anfitrião <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={hostPhone}
                  onChange={(e) => { setHostPhone(e.target.value); clearError('hostPhone'); }}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none ${errors.hostPhone ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'}`}
                  placeholder="(11) 99999-9999" 
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MessageSquare size={16} /> Mensagem de Convite
                </label>
                <button
                  type="button"
                  onClick={handleAiSuggestion}
                  disabled={isGeneratingText}
                  className="text-xs flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-md transition-all disabled:opacity-50"
                >
                  {isGeneratingText ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Escrever com IA
                </button>
              </div>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                placeholder="Olá, gostaria de autorizar sua entrada..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={requestStatus === 'sending' || requestStatus === 'sent'}
              className={`w-full py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5 ${
                authMethod === 'qr_instant' 
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' 
                  : 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
              }`}
            >
              {requestStatus === 'sending' ? (
                <><Loader2 className="animate-spin" size={20} /> Processando...</>
              ) : authMethod === 'qr_instant' ? (
                <><QrCode size={20} /> Gerar Chave de Acesso</>
              ) : (
                <><Send size={20} /> Solicitar Aprovação</>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-col">
        {/* Result Area */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center flex-1 min-h-[500px] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          {/* State: Idle */}
          {requestStatus === 'idle' && !generatedQR && (
            <div className="text-slate-400 max-w-xs relative z-10">
              <div className={`w-24 h-24 bg-${getMethodColor()}-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-${getMethodColor()}-100`}>
                {getMethodIcon()}
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                {authMethod === 'qr_instant' ? 'Acesso Instantâneo' : 'Solicitação Remota'}
              </h3>
              <p className="text-slate-500">
                {authMethod === 'qr_instant' 
                  ? 'Preencha o formulário para gerar um QR Code de acesso imediato.' 
                  : `O anfitrião receberá uma notificação via ${authMethod === 'email_request' ? 'Email' : authMethod === 'whatsapp_request' ? 'WhatsApp' : 'SMS'} para aprovar a entrada.`}
              </p>
            </div>
          )}

          {/* State: Waiting for Approval */}
          {requestStatus === 'sent' && (
            <div className="w-full max-w-md animate-fade-in-down relative z-10">
              <div className="w-28 h-28 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border-4 border-amber-100">
                <Clock size={56} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">Aguardando Aprovação</h4>
              <p className="text-slate-500 mb-8">
                Solicitação enviada via {authMethod === 'email_request' ? 'Email' : authMethod === 'whatsapp_request' ? 'WhatsApp' : 'SMS'} para <span className="font-semibold text-slate-700">{authMethod === 'email_request' ? hostEmail : hostPhone}</span>.<br/>
                O status será atualizado automaticamente.
              </p>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Debug: Simulação</p>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Pendente</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={simulateHostApproval}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <UserCheck size={18} /> Aprovar
                  </button>
                  <button 
                    onClick={simulateHostRejection}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <XCircle size={18} /> Rejeitar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* State: Rejected */}
          {requestStatus === 'rejected' && (
            <div className="w-full max-w-md animate-fade-in-down relative z-10">
              <div className="w-28 h-28 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                <XCircle size={56} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-2">Solicitação Rejeitada</h4>
              <p className="text-slate-500 mb-8">
                O anfitrião negou a solicitação de acesso para <span className="font-semibold text-slate-700">{visitorName}</span>.
              </p>
              <button 
                onClick={resetRequest}
                className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors"
              >
                Nova Solicitação
              </button>
            </div>
          )}

          {/* State: Approved (QR Generated) */}
          {(requestStatus === 'approved' || generatedQR) && !requestStatus.includes('rejected') && generatedQR && (
            <div className="w-full max-w-sm animate-fade-in-down relative z-10">
              {authMethod !== 'qr_instant' && (
                <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
                  <Check size={16} /> Aprovado pelo Anfitrião
                </div>
              )}
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xl mb-8 inline-block relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <img src={generatedQR} alt="QR Code" className="w-64 h-64 mx-auto" />
                <p className="text-[10px] text-slate-300 mt-4 font-mono text-center tracking-widest uppercase">Valid Key</p>
                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <button 
                    onClick={handleCopyToken} 
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2"
                   >
                     <Copy size={16} /> Copiar Código
                   </button>
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-slate-800 mb-2">Acesso Gerado</h4>
              <p className="text-slate-500 mb-8">Válido por {duration} horas para <span className="font-semibold text-slate-900">{visitorName}</span>.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors" onClick={() => alert("Comprovante enviado!")}>
                  <Mail size={18} /> Enviar
                </button>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors" 
                  onClick={handleCopyToken}
                  title="Copiar token codificado para teste"
                >
                  <Copy size={18} /> Copiar Token
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
