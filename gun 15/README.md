Gun 13 ve gun 14'te yazmis oldugum koda `Dogrulama Katmani (Validation Layer)` ekledim.

Derleme Zamanı Tip Kontrolü vs. Çalışma Zamanı Doğrulama

1. Derleme Zamanı Tip Kontrolü (Compile-Time Type Checking)
   **Nedir?** TypeScript'in kod henüz çalışmadan (geliştirme aşamasında veya `tsc` derlemesi sırasında) değişkenlerin tiplerini kontrol etmesidir.
   **Sınırlaması:** Yalnızca geliştirme/derleme aşamasında var olur. Kod JavaScript'e derlendiğinde (`.js`) tüm tip bilgileri silinir (_Type Erasure_).
   **Nerede Yetersiz Kalır?** Dış dünyadan (örneğin GitHub API yanıtları, veritabanı kayıtları, kullanıcı girdileri veya `.env` dosyası) gelen verileri çalışma anında kontrol edemez. API'nin döndürdüğü verinin tanımladığımız `interface` yapısına gerçekten uyup uymadığını garanti edemez.

2. Çalışma Zamanı Doğrulama (Runtime Validation)
   **Nedir?** Zod gibi kütüphaneler kullanılarak uygulamanın çalışması (`node index.js`) anında canlı verilerin şemaya uyup uymadığının kontrol edilmesidir.
   **Avantajı:** Dış kaynaklardan gelen bozuk, eksik veya yanlış tipli verileri anında tespit eder. Geçersiz verilerin veritabanına yazılmasını engeller ve uygulamanın beklenmedik şekilde çökmesini (ör. `TypeError: Cannot read properties of undefined`) önler.

3. Neden İkisi de Gerekli?
   **TypeScript (Compile-Time)** geliştirici deneyimini (DX) artırır, IDE üzerinde otomatik tamamlama (autocomplete) sağlar ve geliştirme sırasındaki mantık hatalarını kod çalışmadan yakalar.
   **Zod (Runtime)** ise uygulamanın çalışma anındaki güvenliğini ve veri bütünlüğünü sağlar. Sisteme yalnızca doğrulanan verilerin girmesine izin verir.
   `z.infer<typeof schema>` kullanarak iki dünyayı birleştiririz: **Tek bir Zod şeması tanımlayarak hem runtime doğrulamayı hem de TypeScript tipini aynı anda elde etmiş oluruz.**

Calistirmak icin `npm run sync -- facebook` komutunu proje konumunda calistirabilirsiniz.
`facebook` ornegimiz fakat farkli sirket isimleri de girilebilir.
Kodun calismasi icin `.env` dosyasi olusturulup icerisine personal access tokeninizi girmeniz gerekiyor,
dosyaniz `.env.example` icerisindeki kaliba uygun olmalidir.

Kodun ciktisinin sonundan ornek asagida, veriler gorulebiliyor:

> npm run sync -- facebook

> gun-15@1.0.0 sync
> tsx src/index.ts facebook

Fetching repos for organization: "facebook"...
Page 1 fetched (100 repos)
Page 2 fetched (69 repos)

API Fetch Summary:

- Total pages fetched: 2
- Total repositories fetched: 169

🔍 Validation Layer Results:

- 169 records passed validation.
- 2 records failed and were skipped.

❌ Detailed Failure Report:
• [bad-repo] -> id: Invalid input: expected number, received string | full_name: Invalid input: expected string, received undefined | private: Invalid input: expected boolean, received undefined | html_url: Invalid input: expected string, received undefined | description: Invalid input: expected string, received undefined | language: Invalid input: expected string, received undefined | stargazers_count: Invalid input: expected number, received undefined | forks_count: Invalid input: expected number, received undefined
• [missing-id-repo] -> id: Invalid input: expected number, received undefined | full_name: Invalid input: expected string, received undefined | private: Invalid input: expected boolean, received undefined | html_url: Invalid input: expected string, received undefined | description: Invalid input: expected string, received undefined | language: Invalid input: expected string, received undefined | stargazers_count: Invalid input: expected number, received undefined | forks_count: Invalid input: expected number, received undefined

🛠️ Ensuring database schema exists...
💾 Syncing repositories to database...
✅ Database sync complete!

================ DATABASE SUMMARY REPORT ================
📊 Total Repositories in DB: 169

🌐 Language Breakdown:

- Unknown/None: 13
- C: 14
- C#: 2
- C++: 30
- Go: 2
- HTML: 2
- Haskell: 3
- Java: 5
- JavaScript: 14
- Jupyter Notebook: 1
- Kotlin: 5
- OCaml: 3
- Objective-C++: 2
- PHP: 7
- Python: 16
- Ruby: 9
- Rust: 20
- Shell: 3
- Smarty: 1
- Starlark: 2
- Swift: 5
- TypeScript: 10

⭐ Top 5 Most Starred Repositories:

1.  docusaurus (65713 stars) -> https://github.com/facebook/docusaurus
2.  rocksdb (31898 stars) -> https://github.com/facebook/rocksdb
3.  folly (30469 stars) -> https://github.com/facebook/folly
4.  zstd (27450 stars) -> https://github.com/facebook/zstd
5.  # lexical (23695 stars) -> https://github.com/facebook/lexical
