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

export async function generateFormToken(clientId: string): Promise<string | null> {
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
        client_id: clientId,
        token,
        expires_at: expiresAt.toISOString()
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
      .select('client_id, expires_at, used_at')
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

    return data.client_id;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export async function submitClientForm(token: string, formData: ClientFormValues): Promise<boolean> {
  try {
    // First validate the token
    const clientId = await validateToken(token);
    if (!clientId) {
      toast("Token inválido", {
        description: "O link expirou ou é inválido."
      });
      return false;
    }

    // Update client data
    const { error: clientError } = await supabase
      .from('clients')
      .update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birthDate,
        send_birthday_message: formData.sendBirthdayMessage,
        send_holiday_messages: formData.sendHolidayMessages
      })
      .eq('id', clientId);

    if (clientError) {
      console.error('Error updating client:', clientError);
      throw clientError;
    }

    // Check if anamnesis exists
    const { data: existingAnamnesis } = await supabase
      .from('anamnesis')
      .select('id')
      .eq('client_id', clientId);

    const anamnesisData = {
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

    // Update or create anamnesis
    if (existingAnamnesis && existingAnamnesis.length > 0) {
      const { error: anamnesisError } = await supabase
        .from('anamnesis')
        .update(anamnesisData)
        .eq('client_id', clientId);

      if (anamnesisError) {
        console.error('Error updating anamnesis:', anamnesisError);
        throw anamnesisError;
      }
    } else {
      const { error: anamnesisError } = await supabase
        .from('anamnesis')
        .insert({
          client_id: clientId,
          ...anamnesisData
        });

      if (anamnesisError) {
        console.error('Error creating anamnesis:', anamnesisError);
        throw anamnesisError;
      }
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
    const clientId = await validateToken(token);
    if (!clientId) return null;

    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        anamnesis (*)
      `)
      .eq('id', clientId)
      .single();

    if (error) {
      console.error('Error fetching client by token:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email || '',
      phone: data.phone,
      visits: data.visits || 0,
      lastVisit: data.last_visit || new Date().toISOString(),
      birthDate: data.birth_date,
      sendBirthdayMessage: data.send_birthday_message,
      sendHolidayMessages: data.send_holiday_messages,
      anamnesis: data.anamnesis?.length ? {
        address: data.anamnesis[0].address || '',
        epilepsy: data.anamnesis[0].epilepsy || false,
        hemophilia: data.anamnesis[0].hemophilia || false,
        diabetes: data.anamnesis[0].diabetes || false,
        heartDisease: data.anamnesis[0].heart_disease || false,
        anemia: data.anamnesis[0].anemia || false,
        keloid: data.anamnesis[0].keloid || false,
        dst: data.anamnesis[0].dst || false,
        hepatitis: data.anamnesis[0].hepatitis || false,
        dermatitis: data.anamnesis[0].dermatitis || false,
        otherHealthIssue: data.anamnesis[0].other_health_issue || '',
        allergies: data.anamnesis[0].allergies || '',
        physicalActivity: data.anamnesis[0].physical_activity || false,
        alcohol: data.anamnesis[0].alcohol || false,
        smoke: data.anamnesis[0].smoke || false,
        drugs: data.anamnesis[0].drugs || false,
        goodMeals: data.anamnesis[0].good_meals || '',
        mealQuality: data.anamnesis[0].meal_quality || '',
        sleepHours: data.anamnesis[0].sleep_hours || '',
        medication: data.anamnesis[0].medication || '',
        whichMedication: data.anamnesis[0].which_medication || '',
        bloodPressure: data.anamnesis[0].blood_pressure || '',
        mentalHealth: data.anamnesis[0].mental_health || '',
        anxiety: data.anamnesis[0].anxiety || '',
        depression: data.anamnesis[0].depression || '',
        panic: data.anamnesis[0].panic || '',
        applicationLocation: data.anamnesis[0].application_location || '',
        jewel: data.anamnesis[0].jewel || '',
        observation: data.anamnesis[0].observation || '',
        value: data.anamnesis[0].value || '',
      } : undefined
    };
  } catch (error) {
    console.error('Error in getClientByToken:', error);
    return null;
  }
}