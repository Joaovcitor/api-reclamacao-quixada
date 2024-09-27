import { config } from "dotenv";
import { Sequelize } from "sequelize";

config()

let sequelize;

if (process.env.NODE_ENV === 'test') {
  // Configuração para o ambiente de teste
  config({ path: '.env.test' });
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE,
    logging: false, // Desativa logs de SQL para testes
  });
} else {
  // Configuração para o ambiente de produção
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: 3306,
      dialect: process.env.DB_DIALECT,
      timezone: "-03:00",
      dialectOptions: {
        connectTimeout: 60000, // 60 segundos
      },
    }
  );
}

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize