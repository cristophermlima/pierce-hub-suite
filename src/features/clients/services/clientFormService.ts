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

    // Generate a unique token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

    const { data, error } = await supabase
      .from('client_form_tokens')
      .insert({
        token,
        expires_at: expiresAt.toISOString(),
        user_id: user.id
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
    const { data, error } = await supabase
      .from('client_form_tokens')
      .select('user_id, expires_at, used_at')
      .eq('token', token)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if token is expired
    if (new Date(data.expires_at) < new Date()) {
      return null;
    }

    // Check if token is already used
    if (data.used_at) {
      return null;
    }

    return data.user_id;
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
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birthDate,
        send_birthday_message: formData.sendBirthdayMessage,
        send_holiday_messages: formData.sendHolidayMessages
      })
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      throw clientError;
    }

    // Create anamnesis data
    const anamnesisData = {
      client_id: newClient.id,
      address: formData.address,
      epilepsy: formData.epilepsy,
      hemophilia: formData.hemophilia,
      diabetes: formData.diabetes,
      heart_disease: formData.heartDisease,
      anemia: formData.anemia,
      keloid: formData.keloid,
      dst: formData.dst,
      hepatitis: formData.hepatitis,
      dermatitis: formData.dermatitis,
      other_health_issue: formData.otherHealthIssue,
      allergies: formData.allergies,
      physical_activity: formData.physicalActivity,
      alcohol: formData.alcohol,
      smoke: formData.smoke,
      drugs: formData.drugs,
      good_meals: formData.goodMeals,
      meal_quality: formData.mealQuality,
      sleep_hours: formData.sleepHours,
      medication: formData.medication,
      which_medication: formData.whichMedication,
      blood_pressure: formData.bloodPressure,
      mental_health: formData.mentalHealth,
      anxiety: formData.anxiety,
      depression: formData.depression,
      panic: formData.panic,
      application_location: formData.applicationLocation,
      jewel: formData.jewel,
      observation: formData.observation,
      value: formData.value
    };

    // Create anamnesis
    const { error: anamnesisError } = await supabase
      .from('anamnesis')
      .insert(anamnesisData);

    if (anamnesisError) {
      console.error('Error creating anamnesis:', anamnesisError);
      throw anamnesisError;
    }

    // Mark token as used
    const { error: tokenError } = await supabase
      .from('client_form_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (tokenError) {
      console.error('Error marking token as used:', tokenError);
    }

    return true;
  } catch (error) {
    console.error('Error in submitClientForm:', error);
    toast("Erro ao enviar formulário", {
      description: "Não foi possível enviar o formulário. Tente novamente."
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