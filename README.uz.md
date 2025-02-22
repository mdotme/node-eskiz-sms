# Eskiz SMS Nodejs (Typescript) package

🌐 Tillar: [English](README.md) | [O'zbekcha](README.uz.md)

[Eskiz](https://eskiz.uz)da SMS yuborish uchun Nodejs paket

#### Afzalliklari

- Type'lar mavjud. Typescript'da yozilgan
- Tokenni ko'rsatilgan env faylda saqlaydi
- Token eskirganda avtomatik yangilash
- Ishlatishga oson

## O'rnatish

```bash
pnpm add eskiz-sms
```

## Ishlatish

```typescript
import { EskizSms } from "eskiz-sms";

const sms = new EskizSms({
  email: "your-email@example.com",
  password: "your-password",
});

// !MUHIM!
await sms.init();

sms
  .send({
    mobile_phone: "998901234567",
    message: "Eskiz SMSdan salom!",
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Type'lar

```typescript
import { EskizSmsSendPayload } from "eskiz-sms";

const message: EskizSmsSendPayload = {
  message: "Hello, World!",
  mobile_phone: "905555555555",
};
```

Batafsil ma'lumot uchun [Eskiz API dokumentatsiya](https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest) ga kiring.

## Hissa qo'shish

Loyihaga hissa qo'shish bo'yicha yo'riqnoma.

1. Repository'ni fork qiling.
2. Yange branch oching (`git checkout -b feat/branch`).
3. O'zgartirishlaringizni qiling.
4. O'zgarishlarni commit qiling. Commitlar to'g'ri qoidalar asosida (feat/fix/chore/docs) ingliz tilida bo'lishi zarur (`git commit -m 'feat: x method for doing y job'`).
5. Push qiling (`git push origin feat/branch`).
6. Pull Request oching.

### Development setup

- Node versiya: 22.xx
- Package manager: [pnpm](https://pnpm.io/)
- `.env.test` faylini `.env.test.local` ga nusxalang va o'z eksiz akkauntdagi ma'lumotlaringizni kiring

Batafsil yo'riqnoma uchun [CONTRIBUTING.md](CONTRIBUTING.md)ga kiring.

## Litsenziya

Bu loyiha ISC Litsenziyasi ostida litsenziyalangan - tafsilotlar uchun [LICENSE](LICENSE) fayliga qarang.

## Aloqa

Manuchehr - [manuchehr.me](https://manuchehr.me)

Loyiha manzili: [https://github.com/mdotme/node-eskiz-sms](https://github.com/mdotme/node-eskiz-sms)

_Ko'p terminlarni o'zbek tiliga o'girib bo'lmagani uchun va tushunishga oson bo'lishi uchun o'z holicha qoldirdim. To'g'ri tushunasiz degan umiddaman_ 😅
