import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.7";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInviteRequest {
  email: string;
  name: string;
  role: string;
  ownerName: string;
  businessName: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, name, role, ownerName, businessName }: TeamInviteRequest = await req.json();

    if (!email || !name) {
      throw new Error("Email e nome são obrigatórios");
    }

    // Gerar senha temporária
    const tempPassword = crypto.randomUUID().slice(0, 12);

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || "",
        role: role,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error("Falha ao criar usuário");
    }

    // Gerar link de reset de senha
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/auth?recovery=true`,
      },
    });

    if (resetError) {
      console.error("Reset link error:", resetError);
    }

    const resetLink = resetData?.properties?.action_link || "";

    // Enviar email de convite
    const emailResponse = await resend.emails.send({
      from: "PiercerHub <onboarding@resend.dev>",
      to: [email],
      subject: `Você foi convidado para a equipe ${businessName || "PiercerHub"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px;">Olá, ${name}!</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            ${ownerName || "O administrador"} convidou você para fazer parte da equipe <strong>${businessName || "PiercerHub"}</strong> como <strong>${role || "Membro"}</strong>.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Para acessar o sistema, clique no botão abaixo para criar sua senha:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Criar minha senha
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            Se o botão não funcionar, copie e cole este link no seu navegador:<br>
            <a href="${resetLink}" style="color: #7c3aed;">${resetLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Este é um email automático do PiercerHub. Se você não esperava este convite, pode ignorar este email.
          </p>
        </div>
      `,
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: "Convite enviado com sucesso" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-team-invite:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
