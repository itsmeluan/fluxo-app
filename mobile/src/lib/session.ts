/**
 * Persistência local de "sessão" — stand-in até existir auth de verdade
 * (Épico 1). Hoje só guarda a flag de onboarding concluído, para o app não
 * recomeçar no Onboarding a cada abertura. Quando houver login real, este
 * arquivo vira o lugar de guardar/limpar o token de sessão.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_ONBOARDING = "@fluxo/onboarding-concluido";

export async function onboardingFoiConcluido(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(CHAVE_ONBOARDING)) === "true";
  } catch {
    return false;
  }
}

export async function marcarOnboardingConcluido(): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_ONBOARDING, "true");
  } catch {
    // Silencioso de propósito: se o storage falhar, o pior caso é o usuário ver
    // o onboarding de novo — não vale derrubar o fluxo por isso.
  }
}
