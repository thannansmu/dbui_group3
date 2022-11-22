exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.primary('email');
      table.string('name');
      table.integer('age');
      table.integer('desired_roomates');
      table.string('city');
      table.string('bio');
      table.string('gender');
      table.string('desired_gender');
      //preference table foreign key???
      //constraints in knex???
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
