module.exports = [
  {
    name: 'default',
    type: 'mysql',
    host: '216.172.172.187',
    port: 3306,
    username: 'nahora08_beegin',
    password: 'Beegin100%',
    database: 'nahora08_poker',
    schema: '',
    synchronize: false,
    entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations',
    },
  },
];
