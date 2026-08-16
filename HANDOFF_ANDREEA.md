# Predare — proiectul Andreea Valeria

Fișierul ăsta există ca o sesiune nouă (mai ales una locală) să poată prelua
munca fără să reconstruiască nimic din context.

## Ce e proiectul

Personaj AI: **Andreea Valeria**, Higgsfield Soul 2.0, `soul_id` **Alcott**.
Creator de lifestyle/lux pentru TikTok și Reels, public din România.
Se produc imagini în Higgsfield, apoi o parte din ele devin videoclipuri i2v.

## Reguli care nu se negociază

Astea au fost câștigate prin greșeli. Nu le rescrie „ca să sune mai bine".

1. **Nu descrie niciodată identitatea** — față, piele, etnie, păr, trăsături.
   Soul-ul le blochează. Dacă le scrii în prompt, intri în conflict cu modelul.
   Descrii doar: ținută, poză, loc, lumină, atmosferă, paletă, tehnică de cameră.
2. **Zero nuditate, zero zone intime, zero formulare sexual explicită.** Inclusiv
   la swimwear și lenjerie. Atrăgător, nu vulgar.
   Formula de acoperire care funcționează, verbatim:
   *„thick, opaque, solid material that covers the chest and provides a visible
   yet tasteful medium decolletage"*.
3. **Telefon în cadru + încadrare medie sau full-length = modelul inventează o
   oglindă.** La arm's length nu încape decât bust. Deci: selfie = chest-up, cu
   „no phone or mirror in the image" și brațul dinspre cameră scos din cadru.
   Orice cadru întreg se scrie ca third-person.
4. **Cadrele din spate cad în frontal dacă lași orice indiciu de față** —
   inclusiv ochelari. Se deschide cu „A rear-view..." sau „A three-quarter
   rear-angle...", se taie indiciile faciale, și se închide cu o frază de
   întărire („The camera stays behind her hip line...").
5. **Formele nu vin din adjective, vin din mecanică:** cameră la înălțimea
   coapsei, unghi de jos, distanță mică, șoldul dinspre lentilă împins spre ea,
   piciorul de sprijin blocat drept, bazin înclinat, și **lumină laterală
   razantă** — fără ea rotunjimea se citește ca contur, nu ca volum.
6. **Cadru de vlog ≠ compoziție strâmbă.** Compoziția rămâne curată și stabilă.
   Se schimbă doar ce *face* ea. Stil day-in-my-life de TikTok, nu vlog YouTube.
7. **Locurile reale nu se descriu în text** — modelul le interpretează mereu
   greșit. Se atașează o poză-placă a locului, iar promptul spune doar plasare,
   scară, contact cu solul, direcția umbrei și white balance.

## Fișierele

| Fișier | Ce e |
|---|---|
| `andreea_prompt_bank.md` | 139 de prompturi, 6 secțiuni: Premium/Luxury 14, Streetwear 12, Bedroom/Lounge 24, Swimwear 20, Everyday/Food 30, România 39 |
| `romania_location_research.md` | Cercetare pe România: litoral, Deltă, Cazane, Carpați, orașe, retail, mâncare, Therme/Salina, **oamenii**, plus cele 10 semnale vizuale care fac o imagine să se citească „România" |
| `romania_reference_shotlist.md` | De unde iei placa de referință pentru fiecare din cele 39 de cadre România |

Banca e publicată și ca pagină de citit/copiat:
https://claude.ai/code/artifact/c26f9881-d1b4-477c-9388-2ac970334f7d

Branch de lucru: `claude/alcott-content-bank-r846us`.

## Ce urmează — task-ul deschis

În Higgsfield Assets există folderul **Andreea Valeria** cu **370 de asset-uri**.
(Workspace-ul total: 628 — 456 imagini, 125 video, 85 audio.)

**Higgsfield MCP nu expune folderele.** `show_medias` întoarce o listă plată,
paginată. Nu există niciun tool de folder/colecție — folderele sunt doar în UI.
Nu e o limitare de model, e o gaură în API. Deci imaginile trebuie puse în fața
modelului altfel: descărcate local.

### Pașii, în ordine

1. **Descarcă folderul** din Higgsfield într-un director local. Păstrează
   numele de fișier exact cum le dă Higgsfield (ID-urile lungi) — fără ele,
   lista de clasificare nu se mai poate mapa pe asset-urile reale.
2. **Redimensionare** la 512px pe latura lungă, doar pentru citire. E destul ca
   să judeci ținuta, încadrarea și defectele de mâini. (Local, scriptul de
   resize îl scrie Claude; vezi `resize_assets.ps1` dacă a rămas în scratchpad.)
3. **Clasificare** — toate cele 370, într-un tabel:

   `fișier | ținută | scenă | VIDEO/POZĂ | grup de mișcare | observații`

   La observații se marchează: mâini deformate, ochelari topiți, față
   inconsistentă cu Soul-ul, duplicate.
4. **Structura de foldere** — 8 foldere, primul fiind „01 Oraș & localuri".
5. **Test** — 10 cadre din „01 Oraș & localuri" trecute prin i2v, revizuite,
   promptul de mișcare ajustat.
6. **Scalare** în loturi de 20.

### Regula pentru i2v

O singură acțiune pe clip. Un cadru care are deja o acțiune clară în el
(merge, ridică paharul, se întoarce) devine video. Un cadru static, frumos
compus, rămâne poză de post.

## Blocaje de mediu (valabile în sesiunea remote, nu neapărat local)

- `d2ol7oe51mr4n9.cloudfront.net` (CDN-ul Higgsfield) — blocat de proxy, deci
  imaginile nu se pot descărca din sesiune.
- `youtu.be`, `nibiru.net`, `ro.wikipedia.org`, `romania-insider.com` — blocate.

Local, nimic din astea nu se aplică.
