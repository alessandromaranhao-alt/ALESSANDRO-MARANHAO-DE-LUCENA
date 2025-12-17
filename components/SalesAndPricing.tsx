import React, { useState } from 'react';
import { Check, ChevronRight, Star } from 'lucide-react';

export const SalesAndPricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'pricing'>('pitch');

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-lg border border-slate-200 inline-flex">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'pitch' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Apresentação de Vendas
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'pricing' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Planos e Preços
          </button>
        </div>
      </div>

      {activeTab === 'pitch' ? <SalesPitch /> : <PricingTable />}
    </div>
  );
};

const SalesPitch = () => {
  const slides = [
    {
      title: "A Revolução da Segurança",
      content: "O AML Security transforma o controle de acesso tradicional em um ecossistema inteligente baseado em dados. Eliminamos erros manuais, reduzimos o tempo de espera e aumentamos a segurança através de IA de ponta.",
      bg: "bg-blue-600",
      img: "https://picsum.photos/800/400?grayscale"
    },
    {
      title: "Verificação com IA",
      content: "Nosso sistema utiliza a IA Google Gemini para analisar documentos e rostos em tempo real. Isso garante que apenas indivíduos autorizados tenham acesso, detectando tentativas de fraude instantaneamente.",
      bg: "bg-indigo-600",
      img: "https://picsum.photos/800/401?grayscale"
    },
    {
      title: "Integração Perfeita",
      content: "Desde autorizações via WhatsApp até travas físicas de portões, o AML Security conecta tudo. Gerencie visitantes, entregas e moradores a partir de um único painel intuitivo.",
      bg: "bg-slate-800",
      img: "https://picsum.photos/800/402?grayscale"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 max-w-4xl mx-auto">
      <div className="relative h-[400px]">
        <img src={slides[currentSlide].img} alt="Slide" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-12">
          <span className="text-cyan-400 font-bold tracking-wider text-sm uppercase mb-2">Por que nos escolher</span>
          <h2 className="text-4xl font-bold text-white mb-4">{slides[currentSlide].title}</h2>
          <p className="text-slate-200 text-lg max-w-2xl">{slides[currentSlide].content}</p>
        </div>
        
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-6 bottom-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all border border-white/30"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-12 flex gap-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-cyan-500' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-8 grid grid-cols-3 gap-8 text-center bg-slate-50 border-t border-slate-100">
        <div>
          <h4 className="text-3xl font-bold text-slate-800 mb-1">60%</h4>
          <p className="text-sm text-slate-500 font-medium">Redução de Custos</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-slate-800 mb-1">99.9%</h4>
          <p className="text-sm text-slate-500 font-medium">Garantia de Uptime</p>
        </div>
        <div>
          <h4 className="text-3xl font-bold text-slate-800 mb-1">24/7</h4>
          <p className="text-sm text-slate-500 font-medium">Monitoramento IA</p>
        </div>
      </div>
    </div>
  );
};

const PricingTable = () => {
  const plans = [
    {
      name: "Iniciante",
      price: 499,
      features: ["10 Usuários", "2 Câmeras", "Rec. Facial Básico", "Alertas por Email"],
      highlight: false
    },
    {
      name: "Profissional",
      price: 999,
      features: ["50 Usuários", "5 Câmeras", "IA de Documentos", "Integração WhatsApp", "Suporte Prioritário"],
      highlight: true
    },
    {
      name: "Empresarial",
      price: 1999,
      features: ["200+ Usuários", "20 Câmeras", "Suporte Multi-local", "API Personalizada", "Gerente Dedicado"],
      highlight: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {plans.map((plan) => (
        <div key={plan.name} className={`relative bg-white rounded-2xl shadow-sm border ${plan.highlight ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-slate-100'} p-8 flex flex-col`}>
          {plan.highlight && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Star size={12} fill="white" /> Mais Popular
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-slate-500">R$</span>
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">/mês</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-slate-600 text-sm">
                <div className={`p-0.5 rounded-full ${plan.highlight ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Check size={12} strokeWidth={3} />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            plan.highlight 
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-200' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}>
            Começar Agora
          </button>
        </div>
      ))}
    </div>
  );
};