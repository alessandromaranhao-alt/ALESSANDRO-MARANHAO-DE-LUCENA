import React, { useState } from 'react';
import { Save, Bell, Shield, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { SystemSettings } from '../types';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    notifications: {
      email: true,
      whatsapp: true,
      sms: false,
    },
    security: {
      facialRecognitionThreshold: 85,
      autoLockDelay: 5,
    },
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof SystemSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSecurityChange = (key: keyof SystemSettings['security'], value: number) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bell size={20} className="text-blue-500" />
            Preferências de Notificação
          </h3>
          <p className="text-slate-500 text-sm mt-1">Configure como o sistema deve alertar administradores e moradores.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">Alertas por Email</p>
                <p className="text-xs text-slate-500">Para relatórios diários e alertas de segurança.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications.email} 
                onChange={() => handleToggle('email')} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">Integração WhatsApp</p>
                <p className="text-xs text-slate-500">Para autorizações rápidas de visitantes.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications.whatsapp} 
                onChange={() => handleToggle('whatsapp')} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">Alertas SMS</p>
                <p className="text-xs text-slate-500">Backup para quando não houver internet.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.notifications.sms} 
                onChange={() => handleToggle('sms')} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Shield size={20} className="text-red-500" />
            Parâmetros de Segurança
          </h3>
          <p className="text-slate-500 text-sm mt-1">Ajuste a sensibilidade e automação do controle de acesso.</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Limiar de Confiança Facial ({settings.security.facialRecognitionThreshold}%)</label>
              <span className="text-xs text-slate-500">Recomendado: 85%+</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="99" 
              value={settings.security.facialRecognitionThreshold}
              onChange={(e) => handleSecurityChange('facialRecognitionThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-slate-500 mt-1">Valores mais altos aumentam a segurança mas podem rejeitar acessos legítimos em condições de pouca luz.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Delay de Trancamento Automático ({settings.security.autoLockDelay}s)</label>
            </div>
            <select 
              value={settings.security.autoLockDelay}
              onChange={(e) => handleSecurityChange('autoLockDelay', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="3">3 Segundos (Rápido)</option>
              <option value="5">5 Segundos (Padrão)</option>
              <option value="10">10 Segundos</option>
              <option value="30">30 Segundos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <Save size={20} />
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};