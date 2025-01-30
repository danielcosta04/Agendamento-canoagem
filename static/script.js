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
        document.getElementById('mensagem').textContent = data.mensagem || 'Cadastro realizado com sucesso!';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

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
        document.getElementById('mensagem').textContent = data.mensagem || 'Login bem-sucedido!';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
