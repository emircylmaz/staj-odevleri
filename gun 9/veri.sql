INSERT INTO uyeler VALUES
(101, 'Ahmet Yilmaz', 'ahmet.yilmaz@email.com'),
(102, 'Ayse Demir', 'ayse.demir@email.com');

INSERT INTO kitaplar VALUES
(301, 'Lord of the Rings', 'J.R.R. Tolkien'),
(302, 'All Tomorrows', 'C. M. Kosemen'),
(303, 'Essays and Aphorisms', 'Arthur Schopenhauer'),
(304, 'The Art of War', 'Sun Tzu'),
(305, 'The Book of Five Rings', 'Miyamoto Musashi');

INSERT INTO odunc_islemleri VALUES
(501, 101, 302, '2026-07-01', '2026-07-10'),
(502, 102, 301, '2026-07-03', NULL),
(503, 101, 303, '2026-07-10', NULL);



--Su an dısarıda olan kitaplar
SELECT kitaplar.kitap, uyeler.uye, odunc_islemleri.odunc_tarihi
FROM odunc_islemleri
INNER JOIN uyeler
    ON odunc_islemleri.uye_id = uyeler.uye_id
INNER JOIN kitaplar
    ON odunc_islemleri.kitap_id = kitaplar.kitap_id
WHERE teslim_tarihi IS NULL;

--En cok odunc alan uye
SELECT uyeler.uye_id, COUNT(odunc_islemleri.islem_id) AS odunc_sayisi
FROM odunc_islemleri
INNER JOIN uyeler
    ON odunc_islemleri.uye_id = uyeler.uye_id
GROUP BY uyeler.uye_id
ORDER BY odunc_sayisi DESC
LIMIT 1;

--Hic odunc alinmamis kitaplar
SELECT kitaplar.kitap_id, kitaplar.kitap
FROM kitaplar
LEFT JOIN odunc_islemleri
    ON kitaplar.kitap_id = odunc_islemleri.kitap_id
WHERE odunc_islemleri.kitap_id IS NULL;