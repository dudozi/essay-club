// 캐시 이름 (버전을 올리면 캐시가 새로고침 됩니다)
const CACHE_NAME = 'essay-club-v2';

self.addEventListener('install', (event) => {
  // 대기하지 않고 즉시 새로운 서비스 워커를 활성화합니다.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 이전 버전의 낡은 캐시를 모두 지워버립니다.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // 활성화 즉시 클라이언트를 제어합니다.
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network First 전략: 무조건 최신 인터넷(깃허브) 파일을 먼저 가져오고, 
  // 인터넷이 끊겼을 때만 창고(캐시)에서 꺼내옵니다.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});