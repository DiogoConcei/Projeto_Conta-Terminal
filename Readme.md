# Sistema bancário

_Este é um sistema bancário simples construído em Node.js. O sistema permite que os usuários criem contas, consultem seus saldos, depositem e saquem dinheiro._

## Como usar :

- Clone o repositório para o seu computador.
- Abra o terminal e navegue até o diretório onde o repositório foi clonado.
- Execute o seguinte comando para instalar as dependências:

  `npm install`

- Execute o seguinte comando para iniciar o sistema:

  `node index.js`

- Siga as instruções na tela para criar uma conta, consultar saldo, depositar ou sacar dinheiro.

### Dependências

- Chalk
- Inquire
-

### Funcionamento do sistema

O sistema funciona por meio de eventos. Quando o usuário escolhe uma opção no menu, o sistema emite um evento correspondente que é manipulado por uma função. O sistema armazena as contas dos usuários em arquivos JSON no diretório **contas**. Quando um usuário deposita ou saca dinheiro, o saldo da conta é atualizado no arquivo JSON correspondente.

### Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

### Autor

Autor: Diogo da Conceição
