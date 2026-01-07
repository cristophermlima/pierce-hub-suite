import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInviteRequest {
  email: string;
  name: string;
  password: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, password }: TeamInviteRequest = await req.json();

    if (!email || !name || !password) {
      return new Response(
        JSON.stringify({ error: "Email, nome e senha são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Senha deve ter no mínimo 6 caracteres" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Tentar criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || "",
      },
    });

    let userId: string;

    if (authError) {
      console.log("Auth error:", authError.message);
      
      // Se o usuário já existe, buscar o ID dele
      if (authError.message?.includes("already been registered") || authError.code === "email_exists") {
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          console.error("Error listing users:", listError);
          return new Response(
            JSON.stringify({ error: "Erro ao buscar usuário existente" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        
        const existingUser = existingUsers.users.find(u => u.email === email);
        if (!existingUser) {
          return new Response(
            JSON.stringify({ error: "Usuário não encontrado" }),
            { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        
        userId = existingUser.id;
        console.log("Using existing user:", userId);
      } else {
        return new Response(
          JSON.stringify({ error: authError.message || "Erro ao criar usuário" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else {
      userId = authData.user?.id || "";
    }
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Falha ao criar usuário" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("User created successfully:", userId, email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: "Usuário criado com sucesso" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-team-invite:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro desconhecido" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
