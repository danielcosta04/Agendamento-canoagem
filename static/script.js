document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var data = {
        email: formData.get('email'),
        senha: formData.get('senha')
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            document.getElementById('mensagem-login').textContent = data.erro;
        } else {
            window.location.href = '/agendamento';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

document.getElementById('cadastro-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var data = {
        nome: formData.get('nome'),
        creditos: formData.get('creditos'),
        email: formData.get('email'),
        senha: formData.get('senha')
    };

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('mensagem-cadastro').textContent = 'Cadastro realizado com sucesso!';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

document.getElementById('agendamento-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);
    var aluno_id = document.getElementById('aluno_id').value;
    var data = {
        horario: formData.get('horario'),
        aluno_id: aluno_id
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
        document.getElementById('mensagem-agendamento').textContent = data.mensagem || 'Agendamento realizado com sucesso!';
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

document.addEventListener('DOMContentLoaded', function() {
    obterAgendamentos();
});
