abstract class Bildirim {
    kanalAdi = "";
    abstract gonder(mesaj: string) : void;
}

class EmailBildirim extends Bildirim {
    kanalAdi = "Email";
    gonder(mesaj:string) {
        console.log(`[${this.kanalAdi}]: ${mesaj}`);
    }
}

class SmsBildirim extends Bildirim {
    kanalAdi = "Sms";
    gonder(mesaj:string) {
        console.log(`[${this.kanalAdi}]: ${mesaj}`);
    }

}

class SlackBildirim extends Bildirim {
    kanalAdi = "Slack";
    gonder(mesaj:string) {
        console.log(`[${this.kanalAdi}]: ${mesaj}`);
    }

}

const list : Bildirim[] = [
new EmailBildirim(),
new SmsBildirim(),
new SlackBildirim()
];

for (const bildirim of list) {
    bildirim.gonder("Merhaba!");
}

class TercihliBildirim{
    private kanallar: Bildirim[]

    constructor(gelenKanallar: Bildirim[]) {
        this.kanallar = gelenKanallar;
    }

    mesajGonder(tercih: string, mesaj: string) {
        const bulunanKanal = this.kanallar.find(kanal => kanal.kanalAdi === tercih)

        if(bulunanKanal) {
            bulunanKanal.gonder(mesaj);
        }
        else {
            throw new Error("Hatali kanal secimi.");
        }
    }

}

const tercihli = new TercihliBildirim(list);
tercihli.mesajGonder("Sms", "Bu bir sms mesajidir.");
tercihli.mesajGonder("Email", "Bu bir sms mesaji degildir.");