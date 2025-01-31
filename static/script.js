document.getElementById('agendamento-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var data = {
        horario: formData.get('horario'),
        aluno_id: formData.get('aluno_id')
    };

    fetch('/agendamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('mensagem').textContent = data.mensagem || 'Agendamento realizado com sucesso!';
        // Atualizar a lista de agendamentos após um novo agendamento
        obterAgendamentos();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

function obterAgendamentos() {
    var aluno_id = document.getElementById('aluno_id').value;
    fetch(`/agendamentos/${aluno_id}`)
    .then(response => response.json())
    .then(data => {
        var lista = document.getElementById('agendamentos-lista');
        lista.innerHTML = '';
        data.forEach(agendamento => {
            var item = document.createElement('li');
            item.textContent = `Aula em ${agendamento.data}`;
            lista.appendChild(item);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Chamar a função para obter a lista de agendamentos ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    obterAgendamentos();
});
