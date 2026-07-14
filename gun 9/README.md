CREATE TABLE ve INDEX komutlari sema.sql icerisinde,
INSERT ve SELECT komutlari ise veri.sql icerisinde bulunuyor.

Index oncesi,
EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE islem_id = 501;

Index uygulanıyor,
CREATE INDEX idx_odunc_islem ON odunc_islemleri(islem_id);

Index sonrasi,
EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE islem_id = 501;