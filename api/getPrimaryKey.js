const query = require('./query')

module.exports = async (mysql) => {
    let sql = "SELECT " +
        "k.column_name " +
        "FROM " +
        "information_schema.table_constraints t " +
        "JOIN information_schema.key_column_usage k USING ( constraint_name, table_schema, table_name ) " +
        "WHERE " +
        "t.constraint_type = 'PRIMARY KEY' " +
        "AND t.table_schema = '" + mysql.configs.database + "' AND t.table_name = '" + mysql.tableName + "'"
    let pk = await query(mysql, sql)
    return pk[0].column_name || ''
}