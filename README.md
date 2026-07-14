# AY Lingo

Çok dilli, sesli telaffuzlu, kod bilmeden yeni dil eklenebilen bir dil öğrenme uygulaması.

- React + Vite + TypeScript
- Backend yok — tüm veriler (profiller, ilerleme, seri) kullanıcının tarayıcısında (`localStorage`) tutulur
- Vercel'e statik site olarak deploy edilir

---

## 1. Uygulamayı bilgisayarında çalıştırma

```
npm install
npm run dev
```

Terminalde çıkan adresi (genelde `http://localhost:5173`) tarayıcıda açman yeterli.

Canlıya çıkacak halini test etmek için:

```
npm run build
npm run preview
```

---

## 2. Yeni bir dil nasıl eklenir? (kod bilmeden, adım adım)

AY Lingo'da her dil kendi dosyasında yaşar. **Yeni bir dil eklemek için tek yapman gereken `src/data/languages/` klasörüne yeni bir dosya eklemek.** Hiçbir React/TypeScript kodunu değiştirmene gerek yok — uygulama açılışta bu klasördeki tüm dosyaları otomatik bulur ve dil seçim ekranında listeler.

### Adım adım

1. `src/data/languages/en.json` dosyasını aç, tamamını kopyala.
2. Aynı klasörde yeni bir dosya oluştur. Dosya adı dilin kısa kodu olmalı, örneğin:
   - Almanca → `de.json`
   - Fransızca → `fr.json`
   - Arapça → `ar.json`
   - Çince → `zh.json`
3. Kopyaladığın içeriği bu yeni dosyaya yapıştır ve aşağıdaki iki bölümü doldur.

### a) `meta` bölümü (dosyanın en üstünde, bir kere doldurulur)

```json
"meta": {
  "code": "de",
  "name": "Almanca",
  "nativeName": "Deutsch",
  "bcp47": "de-DE",
  "direction": "ltr",
  "speechLang": "de-DE"
}
```

| Alan | Ne yazılır |
|---|---|
| `code` | Dilin kısa kodu, dosya adıyla aynı (örn. `"de"`) |
| `name` | Türkçe konuşana gösterilecek isim (örn. `"Almanca"`) |
| `nativeName` | Dilin kendi dilindeki adı (örn. `"Deutsch"`) |
| `bcp47` | Dilin standart kodu — genelde `"xx-YY"` formatında (örn. `"de-DE"`, `"fr-FR"`, `"ar-SA"`, `"zh-CN"`). Emin değilsen bu kodu internetten "BCP-47 [dil adı]" diye arayarak bulabilirsin. |
| `direction` | Dil soldan sağa yazılıyorsa `"ltr"`, sağdan sola yazılıyorsa (Arapça, İbranice gibi) `"rtl"` |
| `speechLang` | Genelde `bcp47` ile aynı değeri yaz. Bu, telaffuz sesinin hangi dilde okunacağını belirler. |

**RTL not:** `direction` alanını `"rtl"` yaparsan, o dil seçildiğinde tüm ekranlar (kartlar, quiz, ilerleme) otomatik olarak sağdan sola dönecek şekilde aynalanır. Ekstra bir ayar yapmana gerek yok.

### b) `words` listesi (kelimeler)

Her kelime şu 7 alandan oluşur:

```json
{
  "word": "Wasser",
  "reading": "vasır",
  "meaning": "su",
  "level": "baslangic",
  "category": "yemek",
  "emoji": "💧",
  "image": ""
}
```

| Alan | Ne yazılır |
|---|---|
| `word` | Kelimenin hedef dildeki doğru yazılışı (Kiril, Arap harfi, Çince karakter — hangi alfabe olursa olsun yazılabilir) |
| `reading` | Bir Türk'ün hiç bilmeden okuyup doğru telaffuz edebileceği şekilde, Türkçe harflerle yazılmış yaklaşık okunuş |
| `meaning` | Kelimenin Türkçe anlamı |
| `level` | Sadece şu üç değerden biri: `"baslangic"`, `"orta"`, `"ileri"` |
| `category` | Serbest bir konu etiketi — `"yemek"`, `"seyahat"`, `"aile"` gibi. Aynı kategoriyi farklı kelimelerde tekrar kullanabilirsin, ilerleme ekranında otomatik gruplanır. |
| `emoji` | Kelimeyi temsil eden tek bir emoji (varsa). Yoksa boş bırak: `""` |
| `image` | Şimdilik hep boş bırak: `""` (ileride görsel eklemek için ayrılmış bir alan) |

Bu nesnelerden istediğin kadar `words` listesinin içine, virgülle ayırarak ekleyebilirsin.

### c) Dosyayı kaydettikten sonra

1. Dosyanın "geçerli JSON" olduğundan emin ol: her `{` bir `}` ile, her `[` bir `]` ile kapanmalı; son elemandan sonra virgül olmamalı. (Bir metin editörü veya [jsonlint.com](https://jsonlint.com) ile kontrol edebilirsin.)
2. `npm run build` komutunu çalıştır. Eğer dosyada bir hata varsa (eksik alan, yanlış `level` değeri gibi), uygulama sana **hangi dosyada, hangi kelimede, hangi alanın eksik olduğunu Türkçe olarak** söyleyecek.
3. Hata yoksa, dili Vercel'e yeniden deploy et (bkz. aşağıdaki "Deploy" bölümü). Yeni dil, dil seçim ekranında otomatik olarak görünecek.

**Özetle: kod dosyalarına asla dokunmana gerek yok. Sadece `src/data/languages/` klasörüne doğru formatta bir `.json` dosyası eklemek yeterli.**

---

## 3. Uygulama nasıl çalışıyor (kısa özet)

- **Profiller**: Aynı cihazda birden fazla aile üyesi kendi profilini oluşturup ayrı ayrı ilerleme kaydedebilir. Şifre yok, sadece isim.
- **Kelime Kartları**: Karta dokununca Türkçe anlam açılır ve kelime otomatik seslendirilir. Hoparlör ikonuna her zaman ayrıca dokunulabilir.
- **Quiz**: Her quiz 10 sorudan oluşur, üç soru tipi karışık gelir (anlamdan kelime seçme, sesi dinleyip kelime seçme, harfleri dizme). Sonunda skor ve yanlışların listesi gösterilir, "Yanlışları Tekrar Et" ile sadece o kelimeler tekrar sorulur.
- **Aralıklı tekrar**: Yanlış yapılan kelimeler daha sık, doğru bilinenler daha seyrek karşına çıkar (basit bir SM-2 mantığı ile).
- **İlerleme ekranı**: Öğrenilen kelime sayısı, günlük seri ve kategori bazlı ilerleme çubukları.

---

## 4. Deploy (Vercel)

Proje Vercel'e bağlıysa, `main` dalına yapılan her `git push` otomatik yeni bir canlı sürüm oluşturabilir (Vercel projeye nasıl bağlandıysa ona göre). Elle deploy etmek için proje klasöründe:

```
vercel --prod
```

komutu yeterlidir.
