const admin = require('firebase-admin');
const serviceAccount = require('./esfiharia-pontense-delivery-firebaseKey.json');
const readline = require('readline');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function registrarPedido() {
    console.log("\n--- REGISTRAR NOVO PEDIDO ---");
    console.log("Tipos de Venda:");
    console.log("1. Unidades Avulsas (R$ 2,00 cada)");
    console.log("2. Combo (10 unidades por R$ 15,00 - sabores fixos)");

    rl.question("Escolha o tipo de venda (1 ou 2): ", (tipoVendaInput) => {
        const tipoVenda = tipoVendaInput.trim();
        let valorPedido;
        let descricaoPedido;

        if (tipoVenda === '1') {
            rl.question("Quantas unidades avulsas? ", (quantidadeInput) => {
                const quantidade = parseInt(quantidadeInput);

                if (isNaN(quantidade) || quantidade <= 0) {
                    console.log("Quantidade inválida. Por favor, digite um número inteiro positivo.");
                    menuPrincipal();
                    return;
                }

                valorPedido = quantidade * 2.00;
                descricaoPedido = `${quantidade} unidades avulsas`;

                rl.question("Forma de Pagamento (Dinheiro, Pix, Cartão): ", (formaPagamentoInput) => {
                    const formaPagamento = formaPagamentoInput.trim();
                    if (formaPagamento === "") {
                        console.log("Forma de pagamento não pode ser vazia.");
                        menuPrincipal();
                        return;
                    }
                    salvarPedido(valorPedido, descricaoPedido, formaPagamento);
                });
            });
        } else if (tipoVenda === '2') {
            rl.question("Quantos combos? ", (quantidadeInput) => {
                const quantidade = parseInt(quantidadeInput);

                if (isNaN(quantidade) || quantidade <= 0) {
                    console.log("Quantidade inválida. Por favor, digite um número inteiro positivo.");
                    menuPrincipal();
                    return;
                }

                valorPedido = quantidade * 15.00;
                descricaoPedido = `${quantidade} combo(s) (10 esfihas cada - sabores fixos)`;

                rl.question("Forma de Pagamento (Dinheiro, Pix, Cartão): ", (formaPagamentoInput) => {
                    const formaPagamento = formaPagamentoInput.trim();
                    if (formaPagamento === "") {
                        console.log("Forma de pagamento não pode ser vazia.");
                        menuPrincipal();
                        return;
                    }
                    salvarPedido(valorPedido, descricaoPedido, formaPagamento);
                });
            });
        } else {
            console.log("Opção de tipo de venda inválida. Por favor, escolha 1 ou 2.");
            menuPrincipal();
        }
    });
}

async function salvarPedido(valor, descricao, formaPagamento) {
    const dataAtual = new Date();
    try {
        await db.collection('pedidos').add({
            valor: valor,
            descricao: descricao,
            data: dataAtual,
            formaPagamento: formaPagamento/*  */
        });
        console.log(`Pedido registrado com sucesso! Valor total: R$ ${valor.toFixed(2)} (${formaPagamento})`);
    } catch (error) {
        console.error("Erro ao registrar o pedido: ", error);
    } finally {
        menuPrincipal();
    }
}

async function registrarGasto() {
    console.log("\n--- REGISTRAR NOVA COMPRA DE MATERIAL ---");

    rl.question("Digite o nome do material: ", (nomeMaterialInput) => {
        const nomeMaterial = nomeMaterialInput.trim();
        if (nomeMaterial === "") {
            console.log("Nome do material não pode ser vazio.");
            menuPrincipal();
            return;
        }

        rl.question("Digite o valor do gasto (ex: 50.00): ", (valorInput) => {
            const valorGasto = parseFloat(valorInput);
            if (isNaN(valorGasto) || valorGasto <= 0) {
                console.log("Valor inválido. Por favor, digite um número positivo.");
                menuPrincipal();
                return;
            }

            rl.question("Digite a categoria do gasto (ex: Ingredientes, Embalagens, Manutenção, Limpeza, Outros): ", async (categoriaInput) => {
                const categoriaGasto = categoriaInput.trim();
                if (categoriaGasto === "") {
                    console.log("Categoria não pode ser vazia.");
                    console.log("Por favor, digite a categoria do gasto.");
                    menuPrincipal();
                    return;
                }

                const dataAtual = new Date();

                try {
                    await db.collection('gastos').add({
                        nome: nomeMaterial,
                        valor: valorGasto,
                        categoria: categoriaGasto,
                        data: dataAtual
                    });
                    console.log("Gasto registrado com sucesso!");
                } catch (error) {
                    console.error("Erro ao registrar o gasto: ", error);
                } finally {
                    menuPrincipal();
                }
            });
        });
    });
}

function menuPrincipal() {
    console.log("\n--- Sistema de Gestão da Esfiharia ---");
    console.log("1. Registrar Novo Pedido");
    console.log("2. Registrar Nova Compra de Material");
    console.log("3. Ver Resumo do Dia");
    console.log("4. Sair");
    console.log("--------------------------------------");

    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao.trim()) {
            case '1':
                registrarPedido();
                break;
            case '2':
                registrarGasto();
                break;
            case '3':
                verResumoDoDia();
                break;
            case '4':
                console.log("Saindo do sistema. Até mais!");
                rl.close();
                break;
            default:
                console.log("Opção inválida. Por favor, escolha um número entre 1 e 4.");
                menuPrincipal();
                break;
        }
    });
}

async function verResumoDoDia() {
    console.log("\n--- RESUMO FINANCEIRO DIÁRIO ---");
    rl.question("Para qual data você quer o resumo? (Formato AAAA-MM-DD, ou 'hoje' para hoje): ", async (dataInput) => {
        let dataAlvo;

        if (dataInput.toLowerCase() === 'hoje') {
            dataAlvo = new Date();
        } else {
            dataAlvo = new Date(dataInput);
            if (isNaN(dataAlvo.getTime())) {
                console.log("Formato de data inválido. Por favor, use AAAA-MM-DD ou 'hoje'.");
                menuPrincipal();
                return;
            }
        }

        const inicioDoDia = new Date(dataAlvo.getFullYear(), dataAlvo.getMonth(), dataAlvo.getDate(), 0, 0, 0);
        const fimDoDia = new Date(dataAlvo.getFullYear(), dataAlvo.getMonth(), dataAlvo.getDate(), 23, 59, 59);

        let totalGanhos = 0;
        let totalGastos = 0;
        const pedidosDoDia = [];
        const gastosDoDia = [];

        const totaisPorFormaPagamento = {
            Dinheiro: 0,
            Pix: 0,
            Cartao: 0,
            Outros: 0
        };

        try {
            const pedidosSnapshot = await db.collection('pedidos')
                .where('data', '>=', inicioDoDia)
                .where('data', '<=', fimDoDia)
                .orderBy('data', 'asc')
                .get();

            pedidosSnapshot.forEach(doc => {
                const pedido = doc.data();
                totalGanhos += pedido.valor;
                pedidosDoDia.push(pedido);

                const formaPagamento = pedido.formaPagamento ? pedido.formaPagamento.trim().toLowerCase() : 'outros';

                if (formaPagamento.includes('dinheiro')) {
                    totaisPorFormaPagamento.Dinheiro += pedido.valor;
                } else if (formaPagamento.includes('pix')) {
                    totaisPorFormaPagamento.Pix += pedido.valor;
                } else if (formaPagamento.includes('cartao') || formaPagamento.includes('cartão')) {
                    totaisPorFormaPagamento.Cartao += pedido.valor;
                } else {
                    totaisPorFormaPagamento.Outros += pedido.valor;
                }
            });
        } catch (error) {
            console.error("Erro ao buscar pedidos: ", error);
        }

        try {
            const gastosSnapshot = await db.collection('gastos')
                .where('data', '>=', inicioDoDia)
                .where('data', '<=', fimDoDia)
                .orderBy('data', 'asc')
                .get();

            gastosSnapshot.forEach(doc => {
                const gasto = doc.data();
                totalGastos += gasto.valor;
                gastosDoDia.push(gasto);
            });
        } catch (error) {
            console.error("Erro ao buscar gastos: ", error);
        }

        const dataFormatada = dataAlvo.toLocaleDateString('pt-BR');
        console.log(`\n--- Resumo para ${dataFormatada} ---`);
        console.log(`Ganhos Totais: R$ ${totalGanhos.toFixed(2)}`);
        console.log(`   - Dinheiro: R$ ${totaisPorFormaPagamento.Dinheiro.toFixed(2)}`);
        console.log(`   - Pix: R$ ${totaisPorFormaPagamento.Pix.toFixed(2)}`);
        console.log(`   - Cartão: R$ ${totaisPorFormaPagamento.Cartao.toFixed(2)}`);
        if (totaisPorFormaPagamento.Outros > 0) {
            console.log(`   - Outros: R$ ${totaisPorFormaPagamento.Outros.toFixed(2)}`);
        }
        console.log(`Gastos Totais: R$ ${totalGastos.toFixed(2)}`);
        const lucro = totalGanhos - totalGastos;
        console.log(`Lucro/Prejuízo: R$ ${lucro.toFixed(2)}`);

        console.log("\nDetalhes dos Pedidos:");
        if (pedidosDoDia.length > 0) {
            pedidosDoDia.forEach((pedido, index) => {
                const hora = pedido.data.toDate().toLocaleTimeString('pt-BR');
                console.log(`${index + 1}. [${hora}] ${pedido.descricao} (${pedido.formaPagamento || 'N/A'}) - R$ ${pedido.valor.toFixed(2)}`);
            });
        } else {
            console.log("Nenhum pedido registrado para esta data.");
        }

        console.log("\nDetalhes dos Gastos:");
        if (gastosDoDia.length > 0) {
            gastosDoDia.forEach((gasto, index) => {
                const hora = gasto.data.toDate().toLocaleTimeString('pt-BR');
                console.log(`${index + 1}. [${hora}] ${gasto.nome} (${gasto.categoria}) - R$ ${gasto.valor.toFixed(2)}`);
            });
        } else {
            console.log("Nenhum gasto registrado para esta data.");
        }

        menuPrincipal();
    });
}

menuPrincipal();