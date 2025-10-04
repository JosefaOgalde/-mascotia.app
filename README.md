# mascotia.app (backend local)

## Requisitos
- Node.js 20/22
- Firebase CLI

## Arrancar
```bash
# instalar deps
cd functions && npm install && cd ..

# si quiero reusar data local exportada:
firebase emulators:start --project demo-mascotia --import ./emulator-data

# o sin import:
# firebase emulators:start --project demo-mascotia
