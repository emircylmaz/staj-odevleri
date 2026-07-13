--Tablo Oluşturma
CREATE TABLE developers(
    id INT, 
    name TEXT, 
    email TEXT, 
    team TEXT
);

--En az 10 kayıt ekleme
INSERT INTO developers VALUES
(1,'Emir','emir@test.com','aTeam'),
(2,'Ahmet','ahmet@test.com','bTeam'),
(3,'Mehmet','mehmet@test.com','aTeam'),
(4,'Ayşe','ayse@test.com','aTeam'),
(5,'Mert','mert@test.com','bTeam'),
(6,'Duru','duru@test.com','aTeam'),
(7,'Eren','eren@test.com','bTeam'),
(8,'Arda','arda@test.com','bTeam'),
(9,'Kaan','kaan@test.com','bTeam'),
(10,'Idil','idil@test.com','bTeam');

--Belirli bir takımdaki (aTeam) geliştiricileri listeleme
SELECT * FROM developers WHERE team = 'aTeam';

--Geliştiricileri isimlerine göre alfabetik sıralama
SELECT * FROM developers ORDER BY name ASC;

--Tablodaki ilk 5 kaydı getirme
SELECT * FROM developers LIMIT 5;

--E-posta adresi girilmemiş (NULL) olanları bulma
SELECT * FROM developers WHERE email IS NULL;

--ID değeri 1 olan kaydın e-posta adresini güncelleme
UPDATE developers SET email = 'emir.new@test.com' WHERE id = 1;

--ID değeri 10 olan kaydı veritabanından silme
DELETE FROM developers WHERE id = 10;