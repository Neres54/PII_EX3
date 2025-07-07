function getById(id) {
    return document.getElementById(id);
}

let tarefas = [];
let idCounter = 1;

const btnAdicionarTarefa = getById('adicionarBtn');
const inputDescricao = getById('descricaoTarefa');
const contadorTotal = getById('totalTarefas');
const contadorConcluidas = getById('tarefasConcluidas');
const contadorGeral = getById('contador');


btnAdicionarTarefa.addEventListener('click', adicionarTarefa);
inputDescricao.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') adicionarTarefa();
});

function formatarData(data) {
    if (!data) return "";
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(data);
}

function criarTarefa(descricao) {
    return {
        id: idCounter++,
        descricao: descricao,
        dataInicio: new Date(),
        dataConclusao: null,
        concluida: false
    };
}

function adicionarTarefa() {
    const descricao = inputDescricao.value.trim();
    
    // Validação (item c)
    if (!descricao) {
        alert('Por favor, insira uma descrição para a tarefa.');
        return;
    }

    const novaTarefa = criarTarefa(descricao);
    tarefas.push(novaTarefa);
    atualizarTabela();
    atualizarContadores();
    
    inputDescricao.value = '';
    inputDescricao.focus();
}

function atualizarTabela() {
    const tabelaBody = getById('tabelaTarefas').querySelector('tbody');
    tabelaBody.innerHTML = '';

    tarefas.forEach(tarefa => {
        const row = tabelaBody.insertRow();
        row.className = tarefa.concluida ? 'tarefa-concluida' : 'tarefa-pendente';

        const celulas = [
            row.insertCell(0), // ID
            row.insertCell(1), // Descrição
            row.insertCell(2), // Data Início
            row.insertCell(3), // Data Conclusão
            row.insertCell(4)  // Ações
        ];

        celulas[0].textContent = tarefa.id;
        celulas[1].textContent = tarefa.descricao;
        celulas[2].textContent = formatarData(tarefa.dataInicio);
        celulas[3].textContent = tarefa.concluida ? formatarData(tarefa.dataConclusao) : 'Em andamento';

        // Botão Concluir/Reabrir (item a)
        const btnConcluirReabrir = document.createElement('button');
        btnConcluirReabrir.textContent = tarefa.concluida ? 'Reabrir' : 'Concluir';
        btnConcluirReabrir.className = tarefa.concluida ? 'reabrirBtn' : 'concluirBtn';

        btnConcluirReabrir.addEventListener('click', function() {
            const index = tarefas.findIndex(t => t.id === tarefa.id);
            if (index !== -1) {
                tarefas[index].concluida = !tarefas[index].concluida;
                tarefas[index].dataConclusao = tarefas[index].concluida ? new Date() : null;
                atualizarTabela();
                atualizarContadores();
            }
            
        });

        // Botão Excluir (itens b e d)
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.className = 'excluirBtn';
        btnExcluir.disabled = tarefa.concluida; // Item b

        if (!tarefa.concluida) {
            btnExcluir.addEventListener('click', function() {
                // Item d - Confirmação antes de excluir
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    tarefas = tarefas.filter(t => t.id !== tarefa.id);
                    atualizarTabela();
                    atualizarContadores();
                }
            });
        }

        celulas[4].appendChild(btnConcluirReabrir);
        celulas[4].appendChild(btnExcluir);
    });
}
//melhoria - ordenação por coluna
 function ordenarTarefas(campo) {
    tarefas.sort((a, b) => {
        if (a[campo] > b[campo]) return 1;
        if (a[campo] < b[campo]) return -1;
        return 0;
    });
    atualizarTabela();
}
//melhora - contador simples

function atualizarContadores() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = total - concluidas;
    
    // Atualiza ambos os contadores
    contadorTotal.textContent = total;
    contadorConcluidas.textContent = concluidas;
    contadorGeral.textContent = `${pendentes} pendente${pendentes !== 1 ? 's' : ''}`;
}


