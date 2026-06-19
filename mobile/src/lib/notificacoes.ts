/**
 * Rituais por notificação (golden source 3.6 Épico 4 / US-007/008, mockup §3.12/3.13).
 *
 * Abordagem de protótipo: notificações LOCAIS agendadas no device (recorrentes
 * mensais), sem backend de push. O conteúdo é genérico-mas-útil e o valor real
 * é calculado quando o usuário abre a tela via deep link:
 *  - Contracheque: dia 1, 9h → abre Contracheque (US-007).
 *  - Alerta de imposto: dia 15, 9h (≈5 dias antes da DAS-MEI, dia 20) → abre
 *    AlertaImposto (US-008).
 *
 * Limitação conhecida: push remoto (com valor já no texto) exigiria guardar o
 * token do device e um scheduler no backend — fora do escopo deste protótipo.
 */

import * as Notifications from "expo-notifications";

// Mostra a notificação mesmo com o app aberto.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type TelaNotificacao = "Contracheque" | "AlertaImposto";

/**
 * Pede permissão e (re)agenda as notificações recorrentes. Idempotente: cancela
 * as anteriores antes de reagendar, para não duplicar a cada abertura.
 */
export async function configurarNotificacoes(): Promise<void> {
  const { status } = await Notifications.getPermissionsAsync();
  let permitido = status === "granted";
  if (!permitido) {
    const pedido = await Notifications.requestPermissionsAsync();
    permitido = pedido.status === "granted";
  }
  if (!permitido) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Seu contracheque está pronto 🧾",
      body: "Toque para ver quanto você ganhou no mês passado.",
      data: { tela: "Contracheque" as TelaNotificacao },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.MONTHLY, day: 1, hour: 9, minute: 0 },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hora de checar seu imposto 💸",
      body: "Veja se seu balde de imposto cobre a guia deste mês.",
      data: { tela: "AlertaImposto" as TelaNotificacao },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.MONTHLY, day: 15, hour: 9, minute: 0 },
  });
}
