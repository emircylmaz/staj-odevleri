SQL database olusturma ve komutlar

Veriyi JSON Yerine Veritabanında Saklamanın 3 Avantajı

1.Hız ve Performans (Indexing & Querying):
Bir JSON dosyasında belirli bir veriyi ararken, programın tüm dosyayı baştan sona okuması (parse etmesi) gerekir. Veritabanlarında ise "indeksleme" mekanizmaları sayesinde milyonlarca satır veri arasından aradığımız bilgiye milisaniyeler içinde ulaşabilir.

2.Veri Bütünlüğü ve Güvenliği (Data Integrity):
Veritabanlarında veri tipleri (INT, TEXT) ve çeşitli kısıtlamalar (Primary Key, NOT NULL vb.) zorunludur. SQL kuralları sayesinde yanlışlıkla hatalı, eksik veya uyumsuz veri girilmesi engellenir. JSON'da ise bu yapısal kontrol tamamen yazılımcının koduna bağlıdır ve hata payı yüksektir.

3.Eşzamanlılık Kontrolü (Concurrency Control):
Aynı anda yüzlerce kullanıcının bir JSON dosyasına veri yazmaya çalıştığı senaryolarda dosya kilitlenir, çöker veya veri kayıpları yaşanır. Veritabanları aynı anda gelen okuma ve yazma taleplerini güvenli bir şekilde sıraya koyarak verinin bozulmasını engeller.