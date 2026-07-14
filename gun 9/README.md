CREATE TABLE ve INDEX komutlari sema.sql icerisinde,
INSERT ve SELECT komutlari ise veri.sql icerisinde bulunuyor.

Index oncesi,
EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE islem_id = 501;
<img width="1133" height="93" alt="image" src="https://github.com/user-attachments/assets/82394e61-4bfa-41e2-9ce2-e3e87e773d44" />


Index uygulanıyor,
CREATE INDEX idx_odunc_islem ON odunc_islemleri(islem_id);

Index sonrasi,
EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE islem_id = 501;
<img width="1142" height="86" alt="image" src="https://github.com/user-attachments/assets/641a0cd3-24a1-472d-8f5b-2e45fbcf03e8" />
