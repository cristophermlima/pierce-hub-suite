import { supabase } from "@/integrations/supabase/client";
import { ClientFormValues } from "../schemas/clientFormSchema";
import { toast } from "sonner";

export interface FormToken {
  id: string;
  token: string;
  client_id: string;
  expires_at: string;
  used_at?: string;
}

export async function generateFormToken(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Rate limiting check - limit to 10 tokens per user per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const { count, error: countError } = await supabase
      .from('client_form_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneHourAgo.toISOString());

    if (countError) throw countError;
    
    if (count && count >= 10) {
      toast("Limite excedido", {
        description: "Muitos tokens gerados recentemente. Tente novamente em 1 hora."
      });
      return null;
    }

    // Generate a unique token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

    const { data, error } = await supabase
      .from('client_form_tokens')
      .insert({
        token,
        expires_at: expiresAt.toISOString(),
        user_id: user.id,
        client_id: crypto.randomUUID() // Placeholder, será atualizado quando o cliente for criado
      })
      .select()
      .single();

    if (error) {
      console.error('Error generating form token:', error);
      throw error;
    }

    return token;
  } catch (error) {
    console.error('Error in generateFormToken:', error);
    toast("Erro ao gerar link", {
      description: "Não foi possível gerar o link do formulário."
    });
    return null;
  }
}

export async function validateToken(token: string): Promise<string | null> {
  try {
    // Use security definer function to validate token without exposing table data
    const { data, error } = await supabase.rpc('validate_client_form_token', {
      token_value: token
    });

    if (error) {
      console.error('Error validating token:', error);
      return null;
    }

    return data as string | null;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export async function submitClientForm(token: string, formData: ClientFormValues): Promise<boolean> {
  try {
    // First validate the token
    const userId = await validateToken(token);
    
    if (!userId) {
      toast("Token inválido", {
        description: "O link expirou ou é inválido."
      });
      return false;
    }

    // Create new client
    const clientData = {
      user_id: userId,
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone,
      birth_date: formData.birthDate && formData.birthDate.trim() !== '' ? formData.birthDate : null,
      send_birthday_message: formData.sendBirthdayMessage,
      send_holiday_messages: formData.sendHolidayMessages
    };
    
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      toast("Erro ao criar cliente", {
        description: clientError.message || "Não foi possível criar o cliente"
      });
      throw clientError;
    }

    // Create anamnesis data
    const anamnesisData = {
      client_id: newClient.id,
      address: formData.address || null,
      epilepsy: formData.epilepsy,
      hemophilia: formData.hemophilia,
      diabetes: formData.diabetes,
      heart_disease: formData.heartDisease,
      anemia: formData.anemia,
      keloid: formData.keloid,
      dst: formData.dst,
      hepatitis: formData.hepatitis,
      dermatitis: formData.dermatitis,
      other_health_issue: formData.otherHealthIssue || null,
      allergies: formData.allergies || null,
      physical_activity: formData.physicalActivity,
      alcohol: formData.alcohol,
      smoke: formData.smoke,
      drugs: formData.drugs,
      good_meals: formData.goodMeals || null,
      meal_quality: formData.mealQuality || null,
      sleep_hours: formData.sleepHours || null,
      medication: formData.medication || null,
      which_medication: formData.whichMedication || null,
      blood_pressure: formData.bloodPressure || null,
      mental_health: formData.mentalHealth || null,
      anxiety: formData.anxiety || null,
      depression: formData.depression || null,
      panic: formData.panic || null,
      application_location: formData.applicationLocation || null,
      jewel: formData.jewel || null,
      observation: formData.observation || null,
      value: formData.value || null
    };

    // Create anamnesis
    const { error: anamnesisError } = await supabase
      .from('anamnesis')
      .insert(anamnesisData);

    if (anamnesisError) {
      console.error('Error creating anamnesis:', anamnesisError);
      toast("Erro ao criar anamnese", {
        description: anamnesisError.message || "Não foi possível criar a anamnese"
      });
      throw anamnesisError;
    }

    // Mark token as used using secure function
    const { error: tokenError } = await supabase.rpc('mark_token_as_used', {
      token_value: token
    });

    if (tokenError) {
      console.error('Error marking token as used:', tokenError);
    }

    return true;
  } catch (error) {
    console.error('Error in submitClientForm:', error);
    toast("Erro ao enviar formulário", {
      description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    });
    return false;
  }
}

export async function getClientByToken(token: string): Promise<any> {
  try {
    const userId = await validateToken(token);
    if (!userId) return null;

    // Return empty form data for new client registration
    return {
      isNewClient: true,
      userId: userId
    };
  } catch (error) {
    console.error('Error in getClientByToken:', error);
    return null;
  }
}