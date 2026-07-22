Editor Tip Incelemesi

Nasıl calistirilir:
`npm run db:reset` **Önerilen:** Mevcut SQLite veritabanı dosyalarını (`.db`) temizler, Drizzle şemasını uygular ve tüm seed + analiz kodunu sıfırdan çalıştırır. 
`npm run db:push` Drizzle şemasını (`src/db/schema.ts`) doğrudan SQLite veritabanı dosyası ile senkronize eder. 
`npm run db:seed` Veritabanını sahte geliştirici, MR ve commit verileriyle doldurur ve Gün 8 analiz sorgularının çıktılarını basar. 
`npm start` Ana giriş noktasını (`src/index.ts`) çalıştırır. 



Editorde 5. sorgunun (`query5`) uzerine gelindiginde cikan tip su sekildedir:
```typescript
const query5: {
    id: number;
    name: string;
}[]

1.Şema Tanımları:
    schema.ts dosyamızda developers.id alanını integer(), developers.name alanını ise text().notNull() olarak
    tanımladık. Drizzle derleyicisi bu tanımları temel alır; .notNull() ifadesini gördüğü için name alanının tipini
    otomatik olarak string | null yerine doğrudan kesin bir string olarak belirler. Benzer şekilde, id alanını da
    bir number olarak eşler.

2.Seçici Seçim:
    Eğer db.select() parantezinin içini boş bıraksaydık, Drizzle LEFT JOIN yapılan commits tablosunun tüm
    kolonlarını da içeren, iç içe geçmiş (nested) ve oldukça karmaşık bir nesne tipi dönecekti. Ancak biz sorguda
    süreci optimize etmek için açıkça bir nesne şablonu belirttik:

    db.select({
        id: schema.developers.id,
        name: schema.developers.name,
    })

3.Dinamik Filtreleme ve Tip Temizliği:
    Drizzle'ın generic fonksiyon mimarisi, girdi olarak verdiğimiz bu seçici nesne yapısını argüman olarak okur.
    LEFT JOIN aşamasından gelen, kafamızı karıştırabilecek diğer tüm kalabalık tablo kolonlarını ve nullable (boş
    dönebilecek) tipleri TypeScript seviyesinde eler. Geriye sadece tam isabetle bizim istediğimiz id: number ve
    name: string alanlarından oluşan temiz bir dizi ([]) tipi bırakır.
