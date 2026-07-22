Github personal access token kullanarak `microsoft` organizasyonunun repolarini
pagination kullanarak dolasarak cektik.

Calistirmak icin `npm start` komutunu proje konumunda calistirabilirsiniz.
Kodun calismasi icin `.env` dosyasi olusturulup icerisine personal access tokeninizi girmeniz gerekiyor,
dosyaniz `.env.example` icerisindeki kaliba uygun olmalidir.

Kodun ciktisinin sonundan ornek asagida, veriler ve denenen hata kodlari gorulebiliyor:

.
.
.
Page 81 fetched (100 repos)
Page 82 fetched (100 repos)
Page 83 fetched (8 repos)

Summary:

- Total pages fetched: 83
- Total repositories: 8208
  Successfully saved repositories to repos.json!

--- Running Required Error Tests ---

[Test 1] Testing 401 Unauthorized...

Fetching repos for organization: "microsoft"...
Error: 401 Unauthorized: Invalid or missing GitHub Token.

[Test 2] Testing 404 Not Found...

Fetching repos for organization: "this-organization-definitely-does-not-exist-12345"...
Error: 404 Not Found: Organization "this-organization-definitely-does-not-exist-12345" does not exist.
