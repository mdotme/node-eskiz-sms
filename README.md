# Eskiz SMS Nodejs (Typescript) package

Nodejs package for sending SMS using [Eskiz](https://eskiz.uz) SMS API.

#### Features

- Type friendly. Written in typescript.
- Saves token in env file
- Refresh token logic with queue
- Easy to use

## Installation

```bash
pnpm add eskiz-sms
```

## Usage

```typescript
import { EskizSms } from 'eskiz-sms';

const sms = new EskizSms({
  email: 'your-email@example.com',
  password: 'your-password',
});

// !IMPORTANT!
await sms.init();

sms
  .send({
    mobile_phone: '998901234567',
    message: 'Hello from Eskiz SMS!',
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Types

```typescript
import { EskizSmsSendPayload } from 'eskiz-sms';

const message: EskizSmsSendPayload = {
  message: 'Hello, World!',
  mobile_phone: '905555555555',
};
```

For more documentation, please visit [Eskiz API documentation](https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest).

## Contributing

Guidelines for contributing to the project.

1. Fork the repository.
2. Create a new branch (`git checkout -b feat/branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

### Development setup

- Node version: 22.xx
- Package manager: [pnpm](https://pnpm.io/)
- Consider copying `.env.test` to `.env.test.local`

See the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

Manuchehr - [manuchehr.me](https://manuchehr.me)

Project Link: [https://github.com/mdotme/node-eskiz-sms](https://github.com/mdotme/node-eskiz-sms)

**Feel free to customize it according to your project's specifics.**
