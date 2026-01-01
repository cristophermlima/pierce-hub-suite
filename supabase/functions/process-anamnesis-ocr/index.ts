import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileType } = await req.json();
    
    if (!fileBase64) {
      throw new Error("Arquivo não fornecido");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const systemPrompt = `Você é um assistente especializado em extrair dados de fichas de anamnese para estúdios de piercing.
    
Analise a imagem da ficha de anamnese e extraia os seguintes dados no formato JSON:

{
  "address": "endereço completo se encontrado",
  "bloodPressure": "pressão arterial se informada",
  "sleepHours": "horas de sono se informadas",
  "medication": "sim ou não se usa medicamentos",
  "whichMedication": "quais medicamentos se informados",
  "allergies": "alergias se informadas",
  "otherHealthIssue": "outros problemas de saúde",
  "mentalHealth": "saúde mental se informada",
  "anxiety": "nível de ansiedade se informado",
  "depression": "informação sobre depressão",
  "panic": "informação sobre pânico",
  "applicationLocation": "local do piercing/procedimento",
  "jewel": "tipo de joia escolhida",
  "value": "valor do procedimento",
  "observation": "observações gerais",
  "epilepsy": true/false,
  "hemophilia": true/false,
  "diabetes": true/false,
  "heartDisease": true/false,
  "anemia": true/false,
  "keloid": true/false,
  "dst": true/false,
  "hepatitis": true/false,
  "dermatitis": true/false,
  "smoke": true/false,
  "alcohol": true/false,
  "drugs": true/false,
  "physicalActivity": true/false
}

Se um campo não for encontrado ou não estiver legível, deixe como null para strings ou false para booleanos.
Retorne APENAS o JSON, sem explicações adicionais.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: systemPrompt 
          },
          { 
            role: "user", 
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${fileType};base64,${fileBase64}`
                }
              },
              {
                type: "text",
                text: "Extraia os dados desta ficha de anamnese preenchida."
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erro ao processar imagem com IA");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "{}";
    
    // Tentar extrair JSON da resposta
    let extractedData = {};
    try {
      // Remover possíveis marcadores de código
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      extractedData = {};
    }

    return new Response(
      JSON.stringify({ extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
