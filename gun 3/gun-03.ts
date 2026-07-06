class BankaHesabi {
    private hesapNo = 0;
    private sahip = "";
    private bakiye = 0;

    constructor(hesapNo: number, sahip: string) {
        this.hesapNo = hesapNo;
        this.sahip = sahip;
        this.bakiye = 0;
        this.islemGecmisi = [];
    }

    private islemGecmisi: { tarih: Date, tur: string, tutar: number }[] = [];

    public paraYatir(tutar : number) {
        //prompt("Hesabiniza eklemek istediginiz miktari girin: " + tutar);
        if (tutar <= 0) throw new Error("Girdiginiz deger pozitif olmalidir.");
        this.bakiye = this.bakiye + tutar;
        console.log(this.hesapNo + " " + this.sahip + ", " + "Hesabinizdaki guncel miktar: " + this.bakiye);
        this.islemGecmisi.push({ tarih: new Date(), tur: "Yatirma", tutar: tutar})
    }

    public paraCek(tutar : number) {
        //prompt("Hesabinizdan cekmek istediginiz miktari girin: " + tutar);
        if (tutar > this.bakiye)
            throw new Error("Hesabinizda yeterli miktarda para bulunmuyor.");
        else {
            this.bakiye = this.bakiye - tutar;
            console.log(this.hesapNo + " " + this.sahip + ", " + "Hesabinizdaki guncel miktar: " + this.bakiye); }
            this.islemGecmisi.push({ tarih: new Date(), tur: "Cekme", tutar: tutar});
    }

    public bakiyeGoster() {
        console.log("Hesabinizdaki guncel miktar: " + this.bakiye);
    }

    public ekstre() {
        console.log("---Ekstre---");
        console.log("Hesap sahibi: " + this.sahip);
        console.log("Hesap no: " + this.hesapNo);
        this.islemGecmisi.forEach(islem => {
            console.log(`${islem.tarih.toLocaleDateString()} | ${islem.tur} | ${islem.tutar} TL`);
        })
        console.log("Guncel miktar: " + this.bakiye);
    }
}

function main() {
    const hesap1 = new BankaHesabi(101, "Emir");
    const hesap2 = new BankaHesabi(102, "Sheena");

    hesap1.paraYatir(500);
    hesap2.paraYatir(1000);
    hesap2.paraCek(200);

    try {
    hesap1.paraCek(10000);
    } catch (e) {
        if (e instanceof Error) {
            console.error("Hata yakalandi: " + e.message);
        } else {
            console.error("Beklenmedik bir hata olustu: " + e);
        }
    }

    hesap1.ekstre();
    hesap2.ekstre();
}

main();