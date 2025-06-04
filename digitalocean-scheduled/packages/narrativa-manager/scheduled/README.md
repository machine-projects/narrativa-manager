# Deploy da Função Scheduled no DigitalOcean Functions

Este documento descreve como realizar o deploy da função `narrativa-manager/scheduled` no namespace definido em `project.yml` usando o CLI `doctl` e um arquivo de variáveis de ambiente.

## Pré-requisitos

- `doctl` instalado e autenticado (defina `DIGITALOCEAN_ACCESS_TOKEN` com seu token).
- Arquivo `.env` em `digitalocean-scheduled/.env` contendo:
  ```dotenv
  REDIS_USER=seu_redis_user
  REDIS_PASSWORD=sua_redis_password
  ```

## Estrutura de diretórios

```
chronograma-do-projeto/
├─ digitalocean-scheduled
│  ├─ .env
│  └─ packages
│     └─ narrativa-manager
│        └─ scheduled
│           ├─ __main__.py
│           └─ README.md  # Este arquivo
```

## Comandos de deploy

### Windows CMD
```bat
cd d:\Projetos\Machine\narrativa-manager
set DIGITALOCEAN_ACCESS_TOKEN=seu_token_da_docean
set OPENWHISK_NAMESPACE=NarrativaManager

doctl serverless deploy . --env digitalocean-scheduled\.env
```

### PowerShell
```powershell
cd d:\Projetos\Machine\narrativa-manager
$env:DIGITALOCEAN_ACCESS_TOKEN="seu_token_da_docean"
$env:OPENWHISK_NAMESPACE="NarrativaManager"

doctl serverless deploy . --env packages\narrativa-manager\scheduled\.env
```

## Observações

- O `--env` aponta para o arquivo `.env` com suas credenciais.
- Namespace e nome da função são definidos em `project.yml`; não precisam ser informados na linha de comando.
- Para atualizar a função após alterações no código, basta executar novamente o comando de deploy.
