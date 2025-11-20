import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.7';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentNotificationRequest {
  appointmentId: string;
  clientEmail: string;
  clientPhone: string;
  clientName: string;
  service: string;
  startTime: string;
  endTime: string;
  location?: string;
  piercerEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      appointmentId,
      clientEmail,
      clientPhone,
      clientName,
      service,
      startTime,
      endTime,
      location,
      piercerEmail,
      userId
    }: AppointmentNotificationRequest & { userId?: string } = await req.json();

    console.log("Processing appointment notification:", { appointmentId, clientEmail, clientName });

    // Get piercer email from auth if not provided
    let finalPiercerEmail = piercerEmail;
    if (!finalPiercerEmail && userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (!userError && userData?.user?.email) {
        finalPiercerEmail = userData.user.email;
        console.log("Piercer email found:", finalPiercerEmail);
      }
    }

    // Format dates for display
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const formattedDate = startDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedStartTime = startDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const formattedEndTime = endDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Generate Google Calendar link
    const gcalStart = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const gcalTitle = encodeURIComponent(service);
    const gcalDetails = encodeURIComponent(`Agendamento: ${service}\nCliente: ${clientName}${location ? `\nLocal: ${location}` : ''}`);
    const gcalLocation = location ? encodeURIComponent(location) : '';
    const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${gcalStart}/${gcalEnd}&details=${gcalDetails}&location=${gcalLocation}`;

    // Generate .ics file content for calendar
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PiercerHub//Appointment//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${appointmentId}@piercerhub.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${gcalStart}`,
      `DTEND:${gcalEnd}`,
      `SUMMARY:${service}`,
      `DESCRIPTION:Agendamento: ${service}\\nCliente: ${clientName}${location ? `\\nLocal: ${location}` : ''}`,
      location ? `LOCATION:${location}` : '',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Lembrete: Agendamento em 1 hora',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    // Generate WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `Olá ${clientName}! ✨\n\n` +
      `Seu agendamento foi confirmado:\n\n` +
      `📅 *Serviço:* ${service}\n` +
      `🗓️ *Data:* ${formattedDate}\n` +
      `⏰ *Horário:* ${formattedStartTime} às ${formattedEndTime}\n` +
      `${location ? `📍 *Local:* ${location}\n` : ''}` +
      `\n✅ Adicione ao seu calendário: ${googleCalendarLink}\n\n` +
      `Nos vemos em breve!`
    );
    const whatsappLink = `https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${whatsappMessage}`;

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .detail { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
            .detail strong { color: #667eea; display: block; margin-bottom: 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Agendamento Confirmado!</h1>
            </div>
            <div class="content">
              <p>Olá ${clientName},</p>
              <p>Seu agendamento foi confirmado com sucesso!</p>
              
              <div class="detail">
                <strong>📅 Serviço</strong>
                ${service}
              </div>
              
              <div class="detail">
                <strong>🗓️ Data</strong>
                ${formattedDate}
              </div>
              
              <div class="detail">
                <strong>⏰ Horário</strong>
                ${formattedStartTime} às ${formattedEndTime}
              </div>
              
              ${location ? `
              <div class="detail">
                <strong>📍 Local</strong>
                ${location}
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${googleCalendarLink}" class="button">📆 Adicionar ao Google Calendar</a>
              </div>
              
              <div class="footer">
                <p>Nos vemos em breve! 💫</p>
                <p style="margin-top: 20px; font-size: 11px;">Este é um email automático, por favor não responda.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to client with .ics attachment
    const clientEmailResponse = await resend.emails.send({
      from: "Studio <onboarding@resend.dev>",
      to: [clientEmail],
      subject: `✨ Agendamento Confirmado - ${service}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'agendamento.ics',
          content: btoa(icsContent),
        },
      ],
    });

    console.log("Client email sent:", clientEmailResponse);

    // Send email to piercer if provided
    let piercerEmailResponse = null;
    if (finalPiercerEmail) {
      const piercerEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .detail { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
              .detail strong { color: #667eea; display: block; margin-bottom: 5px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 Novo Agendamento</h1>
              </div>
              <div class="content">
                <p>Você tem um novo agendamento:</p>
                
                <div class="detail">
                  <strong>👤 Cliente</strong>
                  ${clientName}
                </div>
                
                <div class="detail">
                  <strong>📅 Serviço</strong>
                  ${service}
                </div>
                
                <div class="detail">
                  <strong>🗓️ Data</strong>
                  ${formattedDate}
                </div>
                
                <div class="detail">
                  <strong>⏰ Horário</strong>
                  ${formattedStartTime} às ${formattedEndTime}
                </div>
                
                <div class="detail">
                  <strong>📞 Contato</strong>
                  ${clientPhone}<br>
                  ${clientEmail}
                </div>
                
                ${location ? `
                <div class="detail">
                  <strong>📍 Local</strong>
                  ${location}
                </div>
                ` : ''}
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${googleCalendarLink}" class="button">📆 Adicionar ao Meu Calendário</a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      piercerEmailResponse = await resend.emails.send({
        from: "Studio <onboarding@resend.dev>",
        to: [finalPiercerEmail],
        subject: `🔔 Novo Agendamento - ${clientName}`,
        html: piercerEmailHtml,
        attachments: [
          {
            filename: 'agendamento.ics',
            content: btoa(icsContent),
          },
        ],
      });

      console.log("Piercer email sent:", piercerEmailResponse);
    }

    return new Response(
      JSON.stringify({
        success: true,
        clientEmailId: clientEmailResponse.data?.id,
        piercerEmailId: piercerEmailResponse?.data?.id,
        whatsappLink,
        googleCalendarLink,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-appointment-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
