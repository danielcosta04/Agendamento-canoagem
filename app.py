from flask import Flask, request, jsonify, render_template, url_for, redirect, session
from datetime import datetime, timedelta
import hashlib

app = Flask(__name__)
app.secret_key = 'admin123'

# Banco de dados fictício para alunos e créditos
db_alunos = {
    1: {"nome": "João", "creditos": 5, "email": "joao@example.com", "senha": hashlib.sha256("senha123".encode()).hexdigest()},
    2: {"nome": "Maria", "creditos": 3, "email": "maria@example.com", "senha": hashlib.sha256("senha456".encode()).hexdigest()}
}

# Banco de dados fictício para agendamentos
db_agendamentos = []

def autenticar(email, senha):
    senha_hash = hashlib.sha256(senha.encode()).hexdigest()
    for aluno_id, aluno in db_alunos.items():
        if aluno["email"] == email and aluno["senha"] == senha_hash:
            return True, aluno_id
    return False, None

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastrar_aluno():
    if request.method == 'GET':
        return render_template('cadastro.html')
    novo_aluno = request.get_json()
    aluno_id = len(db_alunos) + 1
    novo_aluno["senha"] = hashlib.sha256(novo_aluno["senha"].encode()).hexdigest()
    db_alunos[aluno_id] = {
        "nome": novo_aluno["nome"],
        "creditos": novo_aluno["creditos"],
        "email": novo_aluno["email"],
        "senha": novo_aluno["senha"]
    }
    return jsonify(id=aluno_id, nome=novo_aluno["nome"]), 201

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    dados_login = request.get_json()
    autenticado, aluno_id = autenticar(dados_login["email"], dados_login["senha"])
    if autenticado:
        session['aluno_id'] = aluno_id
        return redirect(url_for('agendar_aula'))
    return jsonify(erro="Credenciais inválidas"), 401

@app.route('/agendamento', methods=['GET', 'POST'])
def agendar_aula():
    if request.method == 'GET':
        aluno_id = session.get('aluno_id')
        return render_template('agendamento.html', aluno_id=aluno_id)
    agendamento = request.get_json()
    aluno_id = agendamento["aluno_id"]
    data_aula = datetime.strptime(agendamento["data"], "%Y-%m-%d %H:%M:%S")
    if aluno_id not in db_alunos:
        return jsonify(erro="Aluno não encontrado"), 404
    if db_alunos[aluno_id]["creditos"] <= 0:
        return jsonify(erro="Créditos insuficientes"), 400
    db_alunos[aluno_id]["creditos"] -= 1
    db_agendamentos.append({"aluno_id": aluno_id, "data": data_aula})
    return jsonify(mensagem="Aula agendada com sucesso", data=str(data_aula)), 201

@app.route('/cancelamento', methods=['POST'])
def cancelar_aula():
    cancelamento = request.get_json()
    aluno_id = cancelamento["aluno_id"]
    data_aula = datetime.strptime(cancelamento["data"], "%Y-%m-%d %H:%M:%S")
    agendamento_existente = next((a for a in db_agendamentos if a["aluno_id"] == aluno_id and a["data"] == data_aula), None)
    if not agendamento_existente:
        return jsonify(erro="Agendamento não encontrado"), 404
    if datetime.now() > data_aula - timedelta(hours=12):
        return jsonify(erro="Cancelamento permitido apenas até 12h antes do início da aula"), 400

    db_agendamentos.remove(agendamento_existente)
    db_alunos[aluno_id]["creditos"] += 1
    return jsonify(mensagem="Aula cancelada com sucesso"), 200

@app.route('/creditos', methods=['POST'])
def carregar_creditos():
    request_data = request.get_json()
    if datetime.now().day > 5:
        return jsonify(erro="Créditos só podem ser carregados até o dia 05"), 400
    aluno_id = request_data["aluno_id"]
    quantidade_creditos = request_data["quantidade"]
    if aluno_id not in db_alunos:
        return jsonify(erro="Aluno não encontrado"), 404
    db_alunos[aluno_id]["creditos"] += quantidade_creditos
    return jsonify(mensagem="Créditos carregados com sucesso"), 200

@app.route('/alunos/<int:aluno_id>', methods=['GET'])
def obter_aluno(aluno_id):
    if aluno_id not in db_alunos:
        return jsonify(erro="Aluno não encontrado"), 404
    return jsonify(db_alunos[aluno_id])

@app.route('/agendamentos/<int:aluno_id>', methods=['GET'])
def obter_agendamentos(aluno_id):
    agendamentos = [a for a in db_agendamentos if a["aluno_id"] == aluno_id]
    agendamentos.sort(key=lambda x: x["data"])
    return jsonify(agendamentos)

if __name__ == '__main__':
    app.run(debug=True)
