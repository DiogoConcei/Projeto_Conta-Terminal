// Módulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// Módulos internos
const fs = require('fs')
const EventEmitter = require('events')
const Sistema_funcoes = new EventEmitter()

start()

function start() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'sistema',
                message: 'O Que deseja fazer',
                choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
            },
        ]).then((resposta) => {
            const action = resposta.sistema
            if (action === 'Criar conta') {
                Sistema_funcoes.emit('Criar_Conta')
            } else if (action === 'Consultar Saldo') {
                Sistema_funcoes.emit('Consultar_Conta')
            } else if (action === 'Depositar') {
                Sistema_funcoes.emit('Depositar')
            } else if (action === 'Sacar') {
                Sistema_funcoes.emit('Sacar')
            } else {
                console.log(chalk.bgBlueBright.white("Muito obrigado por usar o nosso Sistema!!"))
            }
        })
}

Sistema_funcoes.on('Criar_Conta', () => {
    console.log(chalk.black.bgYellow("Muito obrigado por criar uma conta no nosso banco"))
    console.log(chalk.yellow("Defina as opções da sua conta"))
    registro_conta()
})

function registro_conta() {
    inquirer
        .prompt([
            {
                name: "nome_conta",
                message: 'Qual o  nome da sua conta ?'
            }
        ]).then((nome) => {
            const conta = { nome: nome.nome_conta, saldo: 0 }
            if (!fs.existsSync("contas")) {
                fs.mkdirSync("contas");
            }

            fs.writeFileSync(`contas/${nome.nome_conta}.json`, JSON.stringify(conta), function (err) {
                console.log(err)
            })

            console.log(chalk.bgBlue.black(`Seja bem vindo ao nosso banco ${nome.nome_conta}`))
            start()
        })
}

Sistema_funcoes.on('Consultar_Conta', () => {
    inquirer.prompt([
        {
            name: "Consulta_conta",
            message: "Insira o nome da conta"
        }
    ]).then((conta) => {
        busca(conta.Consulta_conta)
        fs.readFile(`contas/${conta.Consulta_conta}.json`, 'utf-8', (err, data) => {
            let json = JSON.parse(data)
            let saldo = json.saldo
            console.log(chalk.bgRed.black(`O Saldo da conta é ${saldo}`))
            start()
        })
    })
})


Sistema_funcoes.on('Depositar', () => {
    inquirer.prompt([{
        name: 'Escolha_conta',
        message: 'Gostaria de depositar $$ em qual conta ?'
    }]).then((conta) => {
        const conta_operacao_bancaria = conta.Escolha_conta
        busca(conta_operacao_bancaria)
        valor(conta_operacao_bancaria, (saldo) => {
            inquirer.prompt(
                [
                    {
                        name: "Deposito",
                        message: "Quanto você gostaria de depositar ?"
                    },
                ]
            ).then((valor) => {
                let valor_real = parseInt(valor.Deposito)
                let transacao_bancaria = valor_real + saldo
                atualiza_saldo(transacao_bancaria, conta_operacao_bancaria)

            })
        })
    })
})

Sistema_funcoes.on('Sacar', () => {
    inquirer.prompt([{
        name: 'Conta_para_saque',
        message: 'Gostaria de retirar $$ de qual conta ?'
    }]).then((conta) => {
        const conta_operacao_bancaria = conta.Conta_para_saque
        busca(conta_operacao_bancaria)
        valor(conta_operacao_bancaria, (saldo) => {
            inquirer.prompt(
                [
                    {
                        name: "Deposito",
                        message: "Quanto você gostaria de sacar ?"
                    },
                ]
            ).then((valor) => {
                let valor_real = parseInt(valor.Deposito)
                if (saldo > valor_real) {
                    let transacao_bancaria = saldo - valor_real
                    atualiza_saldo(transacao_bancaria, conta_operacao_bancaria)
                } else {
                    console.log(chalk.bgRed.black("Saldo insuficiente para saque"))
                    start()
                }

            })
        })
    })
})


function atualiza_saldo(novo_saldo, conta) {
    fs.readFile(`contas/${conta}.json`, 'utf-8', (err, data) => {
        let conta_atual = JSON.parse(data)
        conta_atual.saldo = novo_saldo
        let conta_saldo_atualizado = JSON.stringify(conta_atual, null, 2)
        fs.writeFile(`contas/${conta}.json`, conta_saldo_atualizado, { flag: 'w+' }, () => { })
        console.log(chalk.bgBlueBright.white('Saldo atualizado com sucesso!'))
        start()
    })
}

function busca(conta_procurada) {
    if (!fs.existsSync(`contas/${conta_procurada}.json`)) {
        console.log(chalk.bgRed.black("Conta não existe"))
        console.log(chalk.bgRed.black("Por favor, crie uma conta"))
        start()
    }

}

function valor(conta, callback) {
    fs.readFile(`contas/${conta}.json`, 'utf-8', (err, data) => {
        const json = JSON.parse(data)
        const saldo = json.saldo
        callback(saldo)
    })
}