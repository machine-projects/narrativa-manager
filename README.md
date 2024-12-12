### Documentação da API de Vídeos

Esta API permite a manipulação de vídeos, incluindo operações de listagem, adição, atualização e remoção. Abaixo estão detalhadas as rotas disponíveis e os parâmetros esperados.

---

### **1. Listar Vídeos**

**Endpoint:** `GET /api/videos`

#### **Descrição:**
Retorna vídeos de forma paginada ou todos os vídeos, com suporte a diversos filtros.

#### **Parâmetros de Query:**
| Parâmetro                    | Tipo     | Obrigatório | Descrição                                                                                         |
|------------------------------|----------|-------------|---------------------------------------------------------------------------------------------------|
| `page`                       | `number` | Não         | Página atual (default: 1).                                                                       |
| `limit`                      | `number` | Não         | Número de vídeos por página (default: 10).                                                       |
| `all`                        | `boolean`| Não         | Se `true`, retorna todos os vídeos, ignorando paginação.                                         |
| `channel_id`                 | `string` | Não         | Filtro pelo ID do canal.                                                                         |
| `channels_ids`               | `string` | Não         | Lista de IDs de canais, separados por vírgula.                                                   |
| `videos_urls`                | `string` | Não         | Lista de URLs de vídeos, separados por vírgula.                                                  |
| `published_after`            | `string` | Não         | Data mínima de publicação (formato ISO).                                                         |
| `published_before`           | `string` | Não         | Data máxima de publicação (formato ISO).                                                         |
| `keywords_in_title`          | `string` | Não         | Palavras-chave para busca no título (case insensitive).                                          |
| `keywords_in_title_presentation` | `string` | Não     | Palavras-chave para busca no título de apresentação (case insensitive).                          |
| `targets`                    | `string` | Não         | Lista de alvos de conteúdo, separados por vírgula.                                               |
| `targetLanguage`             | `string` | Não         | Filtro pelo idioma-alvo.                                                                         |
| `type_platforms`             | `string` | Não         | Lista de plataformas (ex.: `youtube`), separados por vírgula.                                    |
| `adm_channel_id`             | `string` | Não         | ID do administrador do canal.                                                                    |
| `channel_name`               | `string` | Não         | Nome do canal (busca parcial).                                                                   |
| `channel_name_presentation`  | `string` | Não         | Nome de apresentação do canal (busca parcial).                                                   |

#### **Resposta:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": [
    {
      "_id": "67574070be9ac4a11a66cbe3",
      "title": "The 10 Forgotten Truths About...",
      "video_url": "https://www.youtube.com/watch?v=kOb3mFi1yYM",
      "published_at": "2024-12-06T21:30:04.000Z",
      ...
    }
  ]
}
```

---

### **2. Adicionar Vídeo**

**Endpoint:** `POST /api/videos`

#### **Descrição:**
Adiciona um novo vídeo à coleção.

#### **Corpo da Requisição:**
```json
{
  "title": "Título do Vídeo",
  "channelId": "ID do Canal",
  "description": "Descrição do vídeo",
  "url": "https://www.youtube.com/watch?v=exemplo",
  "publishedAt": "2024-12-06T21:30:04.000Z"
}
```

#### **Resposta:**
```json
{
  "message": "Vídeo adicionado com sucesso.",
  "video": {
    "id": "67574070be9ac4a11a66cbe3",
    "title": "Título do Vídeo",
    "channelId": "ID do Canal",
    "description": "Descrição do vídeo",
    "url": "https://www.youtube.com/watch?v=exemplo",
    "publishedAt": "2024-12-06T21:30:04.000Z",
    "createdAt": "2024-12-07T10:00:00.000Z"
  }
}
```

---

### **3. Atualizar Vídeo**

**Endpoint:** `PUT /api/videos`

#### **Descrição:**
Atualiza um vídeo existente pelo ID.

#### **Corpo da Requisição:**
```json
{
  "id": "67574070be9ac4a11a66cbe3",
  "title": "Novo Título",
  "description": "Nova descrição"
}
```

#### **Resposta:**
```json
{
  "message": "Vídeo atualizado com sucesso."
}
```

#### **Erros:**
- `400`: O ID do vídeo é obrigatório.
- `404`: Vídeo não encontrado.

---

### **4. Remover Vídeo**

**Endpoint:** `DELETE /api/videos`

#### **Descrição:**
Remove um vídeo da coleção pelo ID.

#### **Parâmetros de Query:**
| Parâmetro | Tipo     | Obrigatório | Descrição            |
|-----------|----------|-------------|----------------------|
| `id`      | `string` | Sim         | ID do vídeo a remover.|

#### **Resposta:**
```json
{
  "message": "Vídeo removido com sucesso."
}
```

#### **Erros:**
- `400`: O ID do vídeo é obrigatório.
- `404`: Vídeo não encontrado.

---

### **5. Erros Comuns**

#### **500 - Erro Interno do Servidor**
```json
{
  "error": "Erro interno do servidor. Mensagem detalhada."
}
```

---

### **Notas**
- A API suporta paginação e filtros avançados para facilitar consultas específicas.
- Certifique-se de enviar os campos no formato correto, especialmente datas (`ISO 8601`).


#### Link Iframe download Audio Video
```html
<iframe id="widgetv2Api" height="100%" width="100%" allowtransparency="true" scrolling="yes" style="border: none; min-height:800px; display: block;" src="URL"></iframe>
```

### Documentação da API de Sincronização de Vídeos

Esta API permite a sincronização de vídeos entre um serviço externo e o banco de dados da aplicação. Ela é utilizada para atualizar ou inserir vídeos novos de canais especificados.

---

### **Endpoint**

`POST /api/videos/synchronize`

---

### **Descrição**

Sincroniza vídeos de canais especificados com o banco de dados, com a opção de definir um número limitado de itens a sincronizar e um intervalo de datas para filtrar os vídeos.

---

### **Corpo da Requisição**

#### **Parâmetros:**
| Parâmetro         | Tipo        | Obrigatório | Descrição                                                                                      |
|--------------------|-------------|-------------|------------------------------------------------------------------------------------------------|
| `channels_ids`     | `Array`     | Sim         | Lista de IDs dos canais a serem sincronizados.                                                |
| `num_syncronize`   | `number`    | Não         | Número máximo de vídeos a serem sincronizados. Se não especificado, sincroniza todos.         |
| `startDate`        | `string`    | Não         | Data de início do intervalo de sincronização (formato ISO 8601).                              |
| `endDate`          | `string`    | Não         | Data de término do intervalo de sincronização (formato ISO 8601).                             |

#### **Exemplo:**
```json
{
  "channels_ids": ["UC5D6CilDrr1NId7OpFxThPw", "UCGv7lQUVZO4mK5H0"],
  "num_syncronize": 50,
  "startDate": "2024-12-01T00:00:00.000Z",
  "endDate": "2024-12-06T23:59:59.000Z"
}
```

---

### **Resposta**

#### **Exemplo de Resposta com Sucesso:**
```json
{
  "data": {
    "insertedCount": 25,
    "errors": []
  },
  "message": "Sincronização concluida, 25 itens foram atualizados!"
}
```

#### **Campos na Resposta:**
| Campo              | Tipo        | Descrição                                                                                      |
|---------------------|-------------|------------------------------------------------------------------------------------------------|
| `data`             | `Object`    | Objeto contendo informações sobre a sincronização realizada.                                   |
| `data.insertedCount` | `number`   | Quantidade de vídeos que foram inseridos ou atualizados no banco de dados.                    |
| `data.errors`       | `Array`     | Lista de erros ocorridos durante a sincronização (se houver).                                 |
| `message`           | `string`    | Mensagem descritiva do resultado da sincronização.                                            |

---

### **Erros**

#### **405 - Método Não Permitido**
```json
{
  "error": "Método não permitido"
}
```
**Descrição:** A API aceita apenas o método `POST`.

#### **500 - Erro Interno do Servidor**
```json
{
  "error": "Erro ao sincronizar vídeos. Mensagem detalhada."
}
```
**Descrição:** Ocorre quando há falhas no processo de sincronização.

---

### **Notas**
- Os campos `startDate` e `endDate` são opcionais. Se não forem fornecidos, a sincronização considera todos os vídeos disponíveis nos canais especificados.
- Certifique-se de enviar os `channels_ids` como um array válido.
- Use o `num_syncronize` para limitar o número de vídeos processados, otimizando a sincronização em casos de grande volume de dados.


### Documentação da API de Gerenciamento de Canais

Esta API permite o gerenciamento de canais, incluindo o cadastro de novos canais, sincronização automática e consultas paginadas.

---

### **Endpoints**

- **`POST /api/channels`** - Cadastra um novo canal.
- **`GET /api/channels`** - Recupera informações sobre os canais.

---

### **POST /api/channels**

#### **Descrição**
Cadastra um novo canal no sistema. Realiza sincronização automática de vídeos do canal após o cadastro.

#### **Parâmetros no Corpo da Requisição**
| Parâmetro              | Tipo      | Obrigatório | Descrição                                                                 |
|------------------------|-----------|-------------|---------------------------------------------------------------------------|
| `custom_name_channel`  | `string`  | Sim         | URL customizada do canal no YouTube (ex: `RomanPaths`).                   |
| `targetLanguage`       | `string`  | Sim         | Código do idioma-alvo (ex: `en`, `pt-BR`).                                |
| `type_platforms`       | `array`   | Sim         | Plataformas associadas ao canal (ex: `["youtube"]`).                      |
| `adm_channel_id`       | `string`  | Sim         | Identificação do administrador do canal.                                  |
| `targets`              | `array`   | Não         | Lista de palavras-chave associadas ao canal (ex: `["history", "roman"]`). |

#### **Exemplo de Requisição**
```json
{
  "custom_name_channel": "RomanPaths",
  "targetLanguage": "en",
  "type_platforms": ["youtube"],
  "adm_channel_id": "Narrativa Gamer",
  "targets": ["history", "roman"]
}
```

#### **Resposta com Sucesso**
```json
{
  "message": "Canal cadastrado com sucesso e sincronizado 100 itens",
  "channel": {
    "id": "64df21c5d87f2c3abc12de45",
    "channel_name_presentation": "Caminhos Romanos",
    "channel_name": "Roman Paths",
    "custom_name_channel": "RomanPaths",
    "channelId": "UC5D6CilDrr1NId7OpFxThPw",
    "language": "Inglês",
    "targetLanguage": "en",
    "type_platforms": ["youtube"],
    "adm_channel_id": "Narrativa Gamer",
    "description": "Descrição traduzida do canal...",
    "image": "https://example.com/channel_image.jpg",
    "applied_videos": 0,
    "createdAt": "2024-12-06T12:00:00.000Z",
    "targets": ["history", "roman"]
  },
  "num_syncronize": 100
}
```

#### **Erros**
- **`400 - Campos obrigatórios ausentes`**
  ```json
  { "error": "Todos os campos são obrigatórios." }
  ```
- **`404 - Canal não encontrado`**
  ```json
  { "error": "Canal não encontrado." }
  ```
- **`409 - Canal já cadastrado`**
  ```json
  { "error": "Canal já está cadastrado." }
  ```

---

### **GET /api/channels**

#### **Descrição**
Recupera informações sobre os canais cadastrados. Suporta filtros, paginação e busca por detalhes específicos.

#### **Parâmetros da Query**
| Parâmetro                    | Tipo      | Obrigatório | Descrição                                                                                     |
|------------------------------|-----------|-------------|------------------------------------------------------------------------------------------------|
| `page`                       | `number`  | Não         | Número da página (padrão: `1`).                                                               |
| `limit`                      | `number`  | Não         | Quantidade de itens por página (padrão: `10`).                                                |
| `all`                        | `boolean` | Não         | Retorna todos os canais se `true` (ignora paginação).                                          |
| `channelId`                  | `string`  | Não         | ID do canal para busca direta.                                                                |
| `custom_name_channel`        | `string`  | Não         | Nome customizado do canal para busca direta.                                                  |
| `channel_name`               | `string`  | Não         | Nome do canal (suporta busca parcial).                                                        |
| `channel_name_presentation`  | `string`  | Não         | Nome de apresentação do canal (suporta busca parcial).                                        |
| `language`                   | `string`  | Não         | Idioma do canal.                                                                               |
| `targetLanguage`             | `string`  | Não         | Idioma-alvo do canal.                                                                          |
| `type_platforms`             | `array`   | Não         | Plataformas associadas ao canal (ex: `youtube`).                                              |
| `adm_channel_id`             | `string`  | Não         | Identificação do administrador do canal.                                                      |
| `applied_videos`             | `number`  | Não         | Número de vídeos aplicados no canal.                                                          |
| `createdAt`                  | `string`  | Não         | Data de criação do canal (formato ISO 8601).                                                  |
| `targets`                    | `array`   | Não         | Palavras-chave associadas ao canal.                                                           |
| `channelsIds`                | `array`   | Não         | Lista de IDs de canais para busca.                                                            |

#### **Exemplo de Requisição**
```http
GET /api/channels?page=1&limit=5&targetLanguage=en&type_platforms=youtube
```

#### **Exemplo de Resposta**
```json
{
  "total": 50,
  "page": 1,
  "limit": 5,
  "totalPages": 10,
  "data": [
    {
      "id": "64df21c5d87f2c3abc12de45",
      "channel_name_presentation": "Caminhos Romanos",
      "channel_name": "Roman Paths",
      "custom_name_channel": "RomanPaths",
      "channelId": "UC5D6CilDrr1NId7OpFxThPw",
      "language": "Inglês",
      "targetLanguage": "en",
      "type_platforms": ["youtube"],
      "adm_channel_id": "Narrativa Gamer",
      "description": "Descrição traduzida do canal...",
      "image": "https://example.com/channel_image.jpg",
      "applied_videos": 0,
      "createdAt": "2024-12-06T12:00:00.000Z",
      "targets": ["history", "roman"]
    }
  ]
}
```

#### **Erros**
- **`404 - Canal não encontrado`**
  ```json
  { "error": "Canal não encontrado." }
  ```
- **`405 - Método não permitido`**
  ```json
  { "error": "Método GET não permitido." }
  ```

---

### **Notas**
- O endpoint `POST` também sincroniza automaticamente os vídeos do canal após o cadastro.
- Utilize filtros no `GET` para otimizar as buscas, especialmente em grandes volumes de dados.
- Todos os endpoints são protegidos contra duplicações e inconsistências de dados.