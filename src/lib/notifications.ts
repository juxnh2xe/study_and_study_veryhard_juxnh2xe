// Notification Ready Helper System (v2.0)

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('[Notification] Permission request failed:', error);
    return false;
  }
}

export function sendNotification(title: string, body: string, icon = '/file.svg') {
  if (!isNotificationSupported()) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
      });
    } catch (error) {
      console.error('[Notification] Failed to send notification:', error);
    }
  }
}

export const NotificationTriggers = {
  onFocusStart: (subjectName: string, minutes: number) => {
    sendNotification(
      '⚡ 새벽 몰입 시작',
      `${subjectName}과 함께하는 ${minutes}분 몰입 세션이 시작되었습니다!`
    );
  },
  onRestTime: () => {
    sendNotification(
      '☕ 뽀모도로 휴식 시간',
      '25분 몰입을 완수하셨습니다! 5분간 가볍게 스트레칭하며 휴식하세요.'
    );
  },
  onRoutineReminder: (routineTitle: string) => {
    sendNotification(
      '📋 오늘의 루틴 점검',
      `아직 달성하지 않은 루틴 "${routineTitle}"이(가) 남아있습니다.`
    );
  },
  onExamDDay: (examTitle: string, dDay: number) => {
    sendNotification(
      '📅 시험 D-Day 알림',
      `목표 시험 "${examTitle}"까지 ${dDay}일 남았습니다. 오늘도 힘내세요!`
    );
  },
};
