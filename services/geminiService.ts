
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDocument = async (base64Image: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return JSON.stringify({ error: "Simulado: Chave API Gemini ausente. Verifique a configuração." });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analise este documento de identificação brasileiro (RG, CNH, CPF). Extraia o Nome Completo (name), Número do Documento (documentNumber) e Data de Nascimento (birthDate). Retorne apenas JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            documentNumber: { type: Type.STRING },
            birthDate: { type: Type.STRING }
          }
        }
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({ error: "Falha ao analisar documento" });
  }
};

export const analyzeFace = async (base64Image: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Simulado: Chave API Gemini ausente.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analise este rosto para cadastro em sistema de segurança. Confirme se é um rosto humano claro, estime a faixa etária e descreva características distintivas para correspondência. Responda em Português do Brasil. Seja breve."
          }
        ]
      }
    });
    return response.text || "Falha na análise.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao analisar rosto.";
  }
};

export const generateSalesPitch = async (topic: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Gerando discurso de vendas simulado...";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie um parágrafo de vendas curto e persuasivo para o sistema "Portaria Pro" focando em: ${topic}. Destaque IA e segurança. Responda em Português do Brasil.`
    });
    return response.text || "Falha na geração do texto.";
  } catch (error) {
    return "Erro ao gerar texto.";
  }
};

export const generateWritingSuggestion = async (context: string, tone: 'formal' | 'friendly' | 'urgent'): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Simulado: Mensagem gerada automaticamente pelo sistema.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escreva uma mensagem curta (máximo 2 frases) de notificação para um sistema de portaria.
      Contexto: ${context}.
      Tom: ${tone === 'formal' ? 'Formal e Profissional' : tone === 'friendly' ? 'Amigável e Atencioso' : 'Urgente e Direto'}.
      Idioma: Português do Brasil.`
    });
    return response.text || "Mensagem não gerada.";
  } catch (error) {
    return "Erro ao gerar sugestão.";
  }
};

export const performSystemDiagnostics = async (logs: string[]): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Diagnóstico simulado: Sistema operando normalmente. Nenhuma anomalia crítica detectada.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analise os seguintes logs do sistema de segurança para identificar possíveis vulnerabilidades ou bugs. Sugira uma correção técnica.
      Logs: ${logs.join('\n')}`
    });
    return response.text || "Diagnóstico inconclusivo.";
  } catch (error) {
    return "Erro ao executar diagnóstico.";
  }
};