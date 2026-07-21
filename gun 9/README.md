CREATE TABLE ve INDEX komutlari sema.sql icerisinde,
INSERT ve SELECT komutlari ise veri.sql icerisinde bulunuyor.

Index oncesi,
EXPLAIN QUERY PLAN SELECT  * FROM odunc_islemleri WHERE teslim_tarihi IS NULL;
Baski:
    QUERY PLAN
    `--SCAN odunc_islemleri

Index uygulanıyor,
CREATE INDEX idx_teslim_tarihi ON odunc_islemleri(teslim_tarihi);

Index sonrasi,
EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE teslim_tarihi IS NULL;
Baski:
    QUERY PLAN
    `--SEARCH odunc_islemleri USING INDEX idx_teslim_tarihi (teslim_tarihi=?)
