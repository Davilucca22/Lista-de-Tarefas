# TaskFlow — gerenciador de tarefas

Aplicação de tarefas com React, Vite, Express e MongoDB.

## Funcionalidades

- Criar, editar, concluir e excluir tarefas com prioridade, categoria e data de vencimento.
- Exibir avisos dentro do app para tarefas que vencem nas próximas 24 horas ou estão atrasadas.
- Filtrar e buscar por texto, status, prazo, prioridade, categoria e responsável.
- Criar equipes, convidar contas existentes e atribuir tarefas a membros.
- Consultar indicadores de tarefas concluídas, pendentes e atrasadas por membro (gestor).
- Persistir tarefas, contas e equipes no MongoDB; o tema permanece salvo no navegador.

Convites são entregues na caixa de entrada do TaskFlow do usuário convidado; o projeto não envia e-mails externos.

## Configuração local

Instale as dependências:

```bash
npm install
```

Crie `Backend/.env` a partir do exemplo:

```powershell
Copy-Item Backend/.env.example Backend/.env
```

Configure `MONGO_URI` para uma instância MongoDB e substitua `JWT_SECRET` por um segredo forte e exclusivo. `INITIAL_MANAGER_EMAIL` define o e-mail reservado à conta gestora inicial (por padrão, `davi@gmail.com`). A conta deve já existir e recebe o papel de gestor após autenticar com a senha correta; o cadastro público desse e-mail reservado é bloqueado.

Inicie o backend e o frontend em terminais separados:

```bash
npm run server
npm run dev
```

O frontend fica em `http://localhost:5173` e o backend em `http://localhost:3000`. O Vite encaminha `/api/*` ao Express.

## Validação

```bash
npm run lint
npm run build
```

## Licença

Veja [LICENSE](./LICENSE).
