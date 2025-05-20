
import { supabase } from "@/integrations/supabase/client";
import { Client, Anamnesis } from "../types";
import { ClientFormValues } from "../schemas/clientFormSchema";
import { toast } from "@/components/ui/sonner";

export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        anamnesis (*)
      `)
      .order('name');

    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email || '',
      phone: item.phone,
      visits: item.visits || 0,
      lastVisit: item.last_visit || new Date().toISOString(),
      birthDate: item.birth_date,
      sendBirthdayMessage: item.send_birthday_message,
      sendHolidayMessages: item.send_holiday_messages,
      anamnesis: item.anamnesis ? mapAnamnesisFromDB(item.anamnesis[0]) : undefined
    }));
  } catch (error) {
    console.error('Error in getClients:', error);
    toast({
      title: "Erro ao carregar clientes",
      description: "Não foi possível carregar a lista de clientes.",
      variant: "destructive",
    });
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        anamnesis (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      throw error;
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
      anamnesis: data.anamnesis?.length ? mapAnamnesisFromDB(data.anamnesis[0]) : undefined
    };
  } catch (error) {
    console.error('Error in getClientById:', error);
    toast({
      title: "Erro ao carregar cliente",
      description: "Não foi possível carregar os detalhes do cliente.",
      variant: "destructive",
    });
    return null;
  }
}

export async function createClient(client: ClientFormValues): Promise<Client | null> {
  try {
    // Primeiro inserimos o cliente
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: client.name,
        email: client.email,
        phone: client.phone,
        birth_date: client.birthDate,
        send_birthday_message: client.sendBirthdayMessage,
        send_holiday_messages: client.sendHolidayMessages
      })
      .select()
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      throw clientError;
    }

    // Em seguida, inserimos a anamnese associada ao cliente
    const { error: anamnesisError } = await supabase
      .from('anamnesis')
      .insert({
        client_id: clientData.id,
        address: client.address,
        epilepsy: client.epilepsy,
        hemophilia: client.hemophilia,
        diabetes: client.diabetes,
        heart_disease: client.heartDisease,
        anemia: client.anemia,
        keloid: client.keloid,
        dst: client.dst,
        hepatitis: client.hepatitis,
        dermatitis: client.dermatitis,
        other_health_issue: client.otherHealthIssue,
        allergies: client.allergies,
        physical_activity: client.physicalActivity,
        alcohol: client.alcohol,
        smoke: client.smoke,
        drugs: client.drugs,
        good_meals: client.goodMeals,
        meal_quality: client.mealQuality,
        sleep_hours: client.sleepHours,
        medication: client.medication,
        which_medication: client.whichMedication,
        blood_pressure: client.bloodPressure,
        mental_health: client.mentalHealth,
        anxiety: client.anxiety,
        depression: client.depression,
        panic: client.panic,
        application_location: client.applicationLocation,
        jewel: client.jewel,
        observation: client.observation,
        value: client.value
      });

    if (anamnesisError) {
      console.error('Error creating anamnesis:', anamnesisError);
      throw anamnesisError;
    }

    toast({
      title: "Cliente adicionado",
      description: "Cliente adicionado com sucesso!",
    });

    return await getClientById(clientData.id);
  } catch (error) {
    console.error('Error in createClient:', error);
    toast({
      title: "Erro ao criar cliente",
      description: "Não foi possível adicionar o cliente.",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateClient(id: string, client: ClientFormValues): Promise<Client | null> {
  try {
    // Primeiro atualizamos o cliente
    const { error: clientError } = await supabase
      .from('clients')
      .update({
        name: client.name,
        email: client.email,
        phone: client.phone,
        birth_date: client.birthDate,
        send_birthday_message: client.sendBirthdayMessage,
        send_holiday_messages: client.sendHolidayMessages
      })
      .eq('id', id);

    if (clientError) {
      console.error('Error updating client:', clientError);
      throw clientError;
    }

    // Verificar se a anamnese já existe para este cliente
    const { data: existingAnamnesis } = await supabase
      .from('anamnesis')
      .select('id')
      .eq('client_id', id);

    const anamnesisData = {
      address: client.address,
      epilepsy: client.epilepsy,
      hemophilia: client.hemophilia,
      diabetes: client.diabetes,
      heart_disease: client.heartDisease,
      anemia: client.anemia,
      keloid: client.keloid,
      dst: client.dst,
      hepatitis: client.hepatitis,
      dermatitis: client.dermatitis,
      other_health_issue: client.otherHealthIssue,
      allergies: client.allergies,
      physical_activity: client.physicalActivity,
      alcohol: client.alcohol,
      smoke: client.smoke,
      drugs: client.drugs,
      good_meals: client.goodMeals,
      meal_quality: client.mealQuality,
      sleep_hours: client.sleepHours,
      medication: client.medication,
      which_medication: client.whichMedication,
      blood_pressure: client.bloodPressure,
      mental_health: client.mentalHealth,
      anxiety: client.anxiety,
      depression: client.depression,
      panic: client.panic,
      application_location: client.applicationLocation,
      jewel: client.jewel,
      observation: client.observation,
      value: client.value
    };

    // Se já existe, atualizamos, caso contrário inserimos uma nova anamnese
    if (existingAnamnesis && existingAnamnesis.length > 0) {
      const { error: anamnesisError } = await supabase
        .from('anamnesis')
        .update(anamnesisData)
        .eq('client_id', id);

      if (anamnesisError) {
        console.error('Error updating anamnesis:', anamnesisError);
        throw anamnesisError;
      }
    } else {
      const { error: anamnesisError } = await supabase
        .from('anamnesis')
        .insert({
          client_id: id,
          ...anamnesisData
        });

      if (anamnesisError) {
        console.error('Error creating anamnesis:', anamnesisError);
        throw anamnesisError;
      }
    }

    toast({
      title: "Cliente atualizado",
      description: "Cliente atualizado com sucesso!",
    });

    return await getClientById(id);
  } catch (error) {
    console.error('Error in updateClient:', error);
    toast({
      title: "Erro ao atualizar cliente",
      description: "Não foi possível atualizar o cliente.",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }

    toast({
      title: "Cliente excluído",
      description: "Cliente excluído com sucesso!",
    });

    return true;
  } catch (error) {
    console.error('Error in deleteClient:', error);
    toast({
      title: "Erro ao excluir cliente",
      description: "Não foi possível excluir o cliente.",
      variant: "destructive",
    });
    return false;
  }
}

function mapAnamnesisFromDB(anamnesis: any): Anamnesis {
  return {
    birthDate: anamnesis.birth_date || '',
    address: anamnesis.address || '',
    epilepsy: anamnesis.epilepsy || false,
    hemophilia: anamnesis.hemophilia || false,
    diabetes: anamnesis.diabetes || false,
    heartDisease: anamnesis.heart_disease || false,
    anemia: anamnesis.anemia || false,
    keloid: anamnesis.keloid || false,
    dst: anamnesis.dst || false,
    hepatitis: anamnesis.hepatitis || false,
    dermatitis: anamnesis.dermatitis || false,
    otherHealthIssue: anamnesis.other_health_issue || '',
    allergies: anamnesis.allergies || '',
    physicalActivity: anamnesis.physical_activity || false,
    alcohol: anamnesis.alcohol || false,
    smoke: anamnesis.smoke || false,
    drugs: anamnesis.drugs || false,
    goodMeals: anamnesis.good_meals || '',
    mealQuality: anamnesis.meal_quality || '',
    sleepHours: anamnesis.sleep_hours || '',
    medication: anamnesis.medication || '',
    whichMedication: anamnesis.which_medication || '',
    bloodPressure: anamnesis.blood_pressure || '',
    mentalHealth: anamnesis.mental_health || '',
    anxiety: anamnesis.anxiety || '',
    depression: anamnesis.depression || '',
    panic: anamnesis.panic || '',
    applicationLocation: anamnesis.application_location || '',
    jewel: anamnesis.jewel || '',
    observation: anamnesis.observation || '',
    value: anamnesis.value || '',
  };
}
