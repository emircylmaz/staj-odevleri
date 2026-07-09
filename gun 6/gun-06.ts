import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const currentDir = dirname(fileURLToPath(import.meta.url));

const HESAPLAR_DOSYASI = join(currentDir, 'hesaplar.json');
const ISLEM_GECMISI_DOSYASI = join(currentDir, 'islemGecmisi.json');


class YetersizBakiyeHatasi extends Error {
    constructor(message = "Hesabinizda yeterli miktarda para bulunmuyor.") {
        super(message);
        this.name = "YetersizBakiyeHatasi";
    }
}

class GecersizTutarHatasi extends Error {
    constructor(message = "Girdiginiz deger pozitif olmalidir.") {
        super(message);
        this.name = "GecersizTutarHatasi";
    }
}

class KayitDosyasiHatasi extends Error {
    constructor(message = "Kayit dosyasinda hata olustu.") {
        super(message);
        this.name = "KayitDosyasiHatasi";
    }
}

class BankaHesabi {
    private hesapNo = 0;
    private sahip = "";
    private bakiye = 0;
    private islemGecmisi: { tarih: Date, tur: string, tutar: number }[] = [];

    constructor(hesapNo: number, sahip: string, bakiye: 0, islemGecmisi: { tarih: Date, tur: string, tutar: number }[] = []) {
        this.hesapNo = hesapNo;
        this.sahip = sahip;
        this.bakiye = bakiye;
        this.islemGecmisi = islemGecmisi;
    }

    public getHesapNo() { return this.hesapNo; }
    public getSahip() { return this.sahip; }
    public getBakiye() { return this.bakiye; }
    public getIslemGecmisi() { return this.islemGecmisi; }

    public paraYatir(tutar : number) {
        //prompt("Hesabiniza eklemek istediginiz miktari girin: " + tutar);
        if (tutar <= 0) throw new GecersizTutarHatasi();
        this.bakiye = this.bakiye + tutar;
        console.log(`${this.hesapNo} ${this.sahip} Hesabinizdaki mevcut miktar: ${this.bakiye}`);
        this.islemGecmisi.push({ tarih: new Date(), tur: "Yatirma", tutar: tutar})
    }

    public paraCek(tutar : number) {
        //prompt("Hesabinizdan cekmek istediginiz miktari girin: " + tutar);
        if (tutar > this.bakiye)
            throw new YetersizBakiyeHatasi();
        else {
            this.bakiye = this.bakiye - tutar;
            console.log(`${this.hesapNo} ${this.sahip} Hesabinizdaki guncel miktar: ${this.bakiye}`); }
            this.islemGecmisi.push({ tarih: new Date(), tur: "Cekme", tutar: tutar});
    }

    public bakiyeGoster() {
        console.log(`${this.hesapNo} ${this.sahip} Hesabinizdaki guncel miktar: ${this.bakiye}`);
    }

    public ekstre() {
        console.log("---Ekstre---");
        console.log("Hesap sahibi: " + this.sahip);
        console.log("Hesap no: " + this.hesapNo);
        this.islemGecmisi.forEach(islem => {
            const tarihObj = new Date(islem.tarih);
            console.log(`${tarihObj.toLocaleDateString()} | ${islem.tur} | ${islem.tutar} TL`);
        })
        console.log(`Guncel miktar: ${this.bakiye}`);
    }



    public transfer(hedefHesap: BankaHesabi, tutar: number) {
        if (tutar <= 0) {
            throw new GecersizTutarHatasi();
        } 
        else if (tutar > this.bakiye) {
            throw new YetersizBakiyeHatasi();
        }
        else {
            this.bakiye = this.bakiye - tutar;
            this.islemGecmisi.push({ tarih: new Date(), tur: "Gonderilen Transfer", tutar: tutar});
            hedefHesap.bakiye = hedefHesap.bakiye + tutar;
            hedefHesap.islemGecmisi.push({ tarih: new Date(), tur: "Gelen Transfer", tutar: tutar});
            console.log(`${this.hesapNo} ${this.sahip} Hesabinizdan ${hedefHesap.getHesapNo()} ${hedefHesap.getSahip()} Hesabina ${tutar} TL transfer edildi.`);
        }
    }

}

async function main() {
    let hesaplarList: BankaHesabi[] = [];

    try {
        const veriHesaplar = await readFile(HESAPLAR_DOSYASI, 'utf-8');
        const hamHesaplar = JSON.parse(veriHesaplar.trim() || "[]");

        const veriGecmis = await readFile(ISLEM_GECMISI_DOSYASI, 'utf-8');
        const hamGecmisler = JSON.parse(veriGecmis.trim() || "[]");

        hesaplarList = hamHesaplar.map((ham: any) => {
            const gecmisKaydi = hamGecmisler.find((kayit: any) => {
                return kayit.hesapNo === ham.hesapNo;
            });

            const hamGecmisDizisi = gecmisKaydi ? gecmisKaydi.gecmis : [];

            const temizGecmis = hamGecmisDizisi.map((islem: any) => ({
                tarih: new Date(islem.tarih),
                tur: islem.tur,
                tutar: islem.tutar
            }));
            return new BankaHesabi(ham.hesapNo, ham.sahip, ham.bakiye, temizGecmis);
        });

        console.log("Kayitli veriler basariyla yuklendi.");
    } catch(error: any) {

        if (error.code === 'ENOENT') {
            console.log(">> Kayit dosyasi bulunamadi. Yeniden baslatiliyor.");
            hesaplarList = [];
        } 

        else if (error instanceof SyntaxError) {
            console.log(">> Kayit dosyasi bozuk (Gecersiz JSON). Yeniden baslatiliyor.");
            hesaplarList = [];
        }

        else {
            throw new KayitDosyasiHatasi(">> Dosya okunurken bilinmeyen bir hata olustu: " + error.message);
        }
    }

    


    
    /*try {
        const aktifHesap = hesaplarList[0];

        aktifHesap.paraYatir(250);
        aktifHesap.paraCek(1000);
        aktifHesap.paraYatir(-500);
        aktifHesap.paraCek(750);
        aktifHesap.ekstre();

    } catch (error: any) {
        if (error instanceof YetersizBakiyeHatasi) {
            console.error(`[Yetersiz Bakiye] ${error.message}`);
        }

        else if (error instanceof GecersizTutarHatasi) {
            console.error(`[Gecersiz Tutar] ${error.message}`);
        }

        else {
            console.error(`[Beklenmedik Hata] ${error.message}`);
        }
    }*/





        // --- TEST ACTIONS ---
    try {
        const aktifHesap = hesaplarList[0];
        console.log("\n--- Islemler Basliyor ---");

        aktifHesap.paraYatir(250);

        try { 
            aktifHesap.paraCek(1000); 
        } catch (e: any) { 
            console.error(`[Yetersiz Bakiye] ${e.message}`); 
        }

        try { 
            aktifHesap.paraYatir(-500); 
        } catch (e: any) { 
            console.error(`[Gecersiz Tutar] ${e.message}`); 
        }

        aktifHesap.paraCek(400); 

        aktifHesap.ekstre();

    } catch (error: any) {
        console.error(`[Beklenmedik Genel Hata] ${error.message}`);
    }

    const gonderen = hesaplarList[0];
    const alici = hesaplarList[1];
    gonderen.transfer(alici, 350);




    try {
        const kaydedilecekHesaplar = hesaplarList.map(h => ({
            hesapNo: h.getHesapNo(),
            sahip: h.getSahip(),
            bakiye: h.getBakiye()
        }));
        const kaydedilecekGecmisler = hesaplarList.map(h => ({
            hesapNo: h.getHesapNo(),
            gecmis: h.getIslemGecmisi()
        }));

        await writeFile(HESAPLAR_DOSYASI, JSON.stringify(kaydedilecekHesaplar, null, 2), 'utf-8');
        await writeFile(ISLEM_GECMISI_DOSYASI, JSON.stringify(kaydedilecekGecmisler, null, 2), 'utf-8');
        console.log(">> Degisiklikler iki ayri dosyaya kaydedildi.")
    } catch(error) {
        throw new KayitDosyasiHatasi("Veriler kaydedilirken hata olustu.");
    }
}

main();