CREATE TABLE IF NOT EXISTS uyeler (
uye_id INTEGER PRIMARY KEY AUTOINCREMENT,
uye TEXT NOT NULL,
eposta TEXT NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS kitaplar (
kitap_id INTEGER PRIMARY KEY AUTOINCREMENT,
kitap TEXT NOT NULL,
yazar TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS  odunc_islemleri (
islem_id INTEGER PRIMARY KEY AUTOINCREMENT,
uye_id INTEGER NOT NULL,
kitap_id INTEGER NOT NULL,
odunc_tarihi DATE NOT NULL,
teslim_tarihi DATE,

FOREIGN KEY (uye_id) REFERENCES uyeler(uye_id),
FOREIGN KEY (kitap_id) REFERENCES kitaplar(kitap_id)
);



EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE islem_id = 501;

CREATE INDEX idx_odunc_islem ON odunc_islemleri(islem_id);

EXPLAIN QUERY PLAN SELECT * FROM odunc_islemleri WHERE islem_id = 501;