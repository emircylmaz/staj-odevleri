"Gun 3 - Basit banka simulasyonu" ust modeli.

Artık kullanıcı bilgileri "hesaplar.json", 
islem gecmisi ise "islemGecmisi.json" adlı ekstra dosyalara isleniyor,
program kapatıldıgında silinmiyor.

Farklı hatalar farklı hata kodları gonderiyor.


"Hata yutma" kod ornegi:
try {
    const veri = await readFile('hesaplar.json', 'utf-8');
    const hamNesne = JSON.parse(veri);
} catch (error) {

}

Bos catch blogu tehlikelidir, cunku herhangi bir sorun olursa gozumuzdan kacabilir,
istenmeyen hatalara ve buglara sebep olabilir ve bundan haberimz olmaz.
Kullanıcı yaptıgı islemşn sorunsuz calıstıgını dusunur ama bilgileri yok olmus olabilir.