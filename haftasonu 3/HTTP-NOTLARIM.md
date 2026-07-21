**GET**: Sunucudan veri okumak için kullanılır. Sunucudaki veriyi değiştirmez.
**POST**: Sunucuda yeni bir veri oluşturmak için kullanılır.
**PUT**: Var olan bir kaynağın tamamını güncellemek için kullanılır.
**PATCH**: Var olan bir kaynağın sadece belirli alanlarını güncellemek için kullanılır.
**DELETE**: Sunucudaki bir kaynağı silmek için kullanılır.

2xx - Basarili 
**200 OK**: İstek başarılı oldu ve yanıt döndürüldü.
**201 Created**: İstek başarılı oldu ve sunucuda yeni bir kaynak oluşturuldu

4xx - Istemci Hatalari
**400 Bad Request**: İstek hatalı veya geçersiz formatta.
**401 Unauthorized**: Kimlik doğrulaması gerekiyor.
**403 Forbidden**: Kimlik doğrulandı fakat bu kaynağa erişim yetkisi yok.
**404 Not Found**: İstenen kaynak sunucuda bulunamadı.
**429 Too Many Requests**: Belli bir sürede çok fazla istek atıldı.

5xx - Sunucu Hatalari
**500 Internal Server Error**: Sunucu tarafında beklenmeyen genel bir hata oluştu.

denedigim curl komutlari ve ciktilari:

    [kullanici listesi cek:]
    >curl https://jsonplaceholder.typicode.com/users
    {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  }.................

    [tek kullanici cek:]
    >curl https://jsonplaceholder.typicode.com/users/1
    {
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }

    [olmayan id iste(404):]
    >curl -i https://jsonplaceholder.typicode.com/users/999
    HTTP/1.1 404 Not Found
Date: Tue, 21 Jul 2026 05:01:31 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 2
Connection: keep-alive
access-control-allow-credentials: true
Cache-Control: max-age=43200
etag: W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"
expires: -1
nel: {"report_to":"heroku-nel","response_headers":["Via"],"max_age":3600,"success_fraction":0.01,"failure_fraction":0.1}
pragma: no-cache
report-to: {"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=jfqEa7nNIekNZN0IqFHPtrkANlrVUsR2w72VKXVKd%2F4%3D\u0026sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d\u0026ts=1784610091"}],"max_age":3600}
reporting-endpoints: heroku-nel="https://nel.heroku.com/reports?s=jfqEa7nNIekNZN0IqFHPtrkANlrVUsR2w72VKXVKd%2F4%3D&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&ts=1784610091"
Server: cloudflare
vary: Origin, Accept-Encoding
via: 2.0 heroku-router
x-content-type-options: nosniff
x-powered-by: Express
x-ratelimit-limit: 1000
x-ratelimit-remaining: 999
x-ratelimit-reset: 1784610138
cf-cache-status: EXPIRED
CF-RAY: a1e7a5f09ffbc4e2-MXP
alt-svc: h3=":443"; ma=86400

{}

[curl -i response headerlarini incele:]
>curl -i https://jsonplaceholder.typicode.com/users/1
HTTP/1.1 200 OK
Date: Tue, 21 Jul 2026 05:02:56 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 509
Connection: keep-alive
access-control-allow-credentials: true
Cache-Control: max-age=43200
etag: W/"1fd-+2Y3G3w049iSZtw5t1mzSnunngE"
expires: -1
nel: {"report_to":"heroku-nel","response_headers":["Via"],"max_age":3600,"success_fraction":0.01,"failure_fraction":0.1}
pragma: no-cache
report-to: {"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=2yqPVG%2FkGfw87Cs4frwKSm6rGBk%2BE8HpaJjGPXh6J%2BQ%3D\u0026sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d\u0026ts=1784493056"}],"max_age":3600}
reporting-endpoints: heroku-nel="https://nel.heroku.com/reports?s=2yqPVG%2FkGfw87Cs4frwKSm6rGBk%2BE8HpaJjGPXh6J%2BQ%3D&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&ts=1784493056"
Server: cloudflare
vary: Origin, Accept-Encoding
via: 2.0 heroku-router
x-content-type-options: nosniff
x-powered-by: Express
x-ratelimit-limit: 1000
x-ratelimit-remaining: 955
x-ratelimit-reset: 1784493060
Age: 23336
Accept-Ranges: bytes
cf-cache-status: HIT
CF-RAY: a1e7a8043b9cc986-MXP
alt-svc: h3=":443"; ma=86400

{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}