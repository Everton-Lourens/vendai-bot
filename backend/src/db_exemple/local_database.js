//APENAS UM EXEMPLO DE BANCO DE DADOS LOCAL EM JSON CRIADO POR CHATGPT
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// Obtém o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
// Obtém o diretório do arquivo atual
const __dirname = dirname(__filename);
const path = resolve(__dirname, './database.json');
// Função para ler o banco de dados
function readDatabase() {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Erro ao ler o banco de dados:', error);
        return {};
    }
}
// Função para escrever no banco de dados
function writeDatabase(data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
        console.log('Banco de dados atualizado com sucesso!');
    }
    catch (error) {
        console.error('Erro ao escrever no banco de dados:', error);
    }
}
// Função para obter um estágio específico
export function getMessageDatabase(stage) {
    const db = readDatabase();
    return db.database[stage] || null;
}
export function getAllItemsDatabase(get_items) {
    const db = readDatabase();
    return db.database[get_items] || null;
}
// Função para atualizar um estágio
function updateStage(stage, messages) {
    const db = readDatabase();
    db.database[stage] = messages;
    writeDatabase(db);
}
