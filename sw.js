// 운동타이머 메모 — 폰 앱 껍데기의 작은 일꾼
// 껍데기판 1~3 : 아무것도 담아 두지 않음 (담아 두면 껍데기를 고쳐도 폰에 옛것이 남음 — 34번에서 겪음)
// 껍데기판 4 (2026-10-05) : 타이머를 인터넷 없이도 열게 «인터넷에서 먼저 받고, 안 되면 담아 둔 것»
//   → 인터넷이 되면 늘 새것 (옛것이 남지 않음) · 껍데기 파일(같은 주소)만 담고 구글 메모 화면은 손대지 않음
const 칸 = '메모껍데기-5';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== 칸) await caches.delete(k);   // 옛 판 담음 지움
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;      // 구글 · 글꼴 등 밖은 평소대로
  e.respondWith((async () => {
    try {
      const 답 = await fetch(e.request, { cache: 'no-store' });
      if (답.ok) { const c = await caches.open(칸); c.put(e.request, 답.clone()); }
      return 답;
    } catch (err) {
      const 담은 = await caches.match(e.request, { ignoreSearch: true });
      if (담은) return 담은;
      throw err;
    }
  })());
});
