import config from './services/config';

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error.message);
      });
  }
}

const base64ToUint8Array = base64 => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const getServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  return registration;
};

export async function subscribeNotification() {
  const registration = await getServiceWorker();

  if (!registration) return;

  const subs = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
  });

  if (subs) {
    await fetch(`${config.apiUrl}/api/notification/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subs),
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}

export async function registerSW() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register(
      config.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
      { type: config.env.MODE === 'production' ? 'classic' : 'module' }
    );
  }
}
