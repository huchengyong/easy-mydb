module.exports = async (_instance) => {
    let sql = "SELECT " +
        "k.column_name " +
        "FROM " +
        "information_schema.table_constraints t " +
        "JOIN information_schema.key_column_usage k USING ( constraint_name, table_schema, table_name ) " +
        "WHERE " +
        "t.constraint_type = 'PRIMARY KEY' " +
        "AND t.table_schema = '" + _instance.dbConfig.database + "' AND t.table_name = '" + _instance.schemaName + "'"
    let pk = await _instance.query(sql)
    return pk[0].column_name || ''
}