import { pool } from '../../connections/conn_postgres.js';
export async function insertPerson(id, { apelido, nome, nascimento, stack }) {
    const query = `
    INSERT INTO
     pessoas(
        id,
        apelido,
        nome,
        nascimento,
        stack
     )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5::json
    )
    `;
    return pool.query(query, [id, apelido, nome, nascimento, JSON.stringify(stack)]);
}
export async function findById(id) {
    const query = `
    SELECT
        id,
        apelido,
        nome,
        to_char(nascimento, 'YYYY-MM-DD') as nascimento,
        stack
    FROM
        pessoas
    WHERE "id" = $1;
    `;
    return pool.query(query, [id]);
}
export async function findByTerm(term) {
    const query = `
    SELECT
        id,
        apelido,
        nome,
        to_char(nascimento, 'YYYY-MM-DD') as nascimento,
        stack
    FROM
        pessoas
    WHERE
        searchable ILIKE $1
    LIMIT 50;`;
    return pool.query(query, [`%${term}%`]);
}
export async function existsByApelido(apelido) {
    const querySet = await pool.query(`SELECT COUNT(1) FROM pessoas WHERE "apelido" = $1`, [apelido]);
    const [result] = querySet.rows;
    return result;
}
