import express from 'express';
import session from 'express-session';
import sequelize from "./src/config/db.js"
import FileStore from 'session-file-store';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import path from 'path';
import os from 'os';

config();

const app = express();

const FileStoreSession = FileStore(session);

// arquivos de rotas

import userRoute from "./src/routes/usersRoute.js"



class Server {
  constructor() {
    this.app = express();
    // aqui vai os sites permitidos do CORS
    this.whiteList = [];

    this.configureMiddlewares();
    this.configureRoutes();
    this.startServer();
  }

  configureMiddlewares() {
    // aqui você configura ao seu gosto
    const corsOptions = {
      origin: (origin, callback) => {
        if (this.whiteList.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by cors"));
        }
      },
      credentials: true,
    };

    this.app.use(cors(corsOptions));
    this.app.use(helmet());

    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );

    this.app.use(
      session({
        name: "session",
        secret: "akdkwodofefgneogeonmefnepddm",
        resave: false,
        saveUninitialized: false,
        store: new FileStoreSession({
          logFn: function () { },
          path: path.join(os.tmpdir(), "sessions"),
        }),
        cookie: {
          secure: false,
          maxAge: 28800000,
          httpOnly: true,
        },
      })
    );

    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(cookieParser());

    this.app.use((req, res, next) => {
      if (req.session.userId) {
        res.locals.session = req.session;
      }
      next();
    });
  }

  configureRoutes() {
    this.app.use("/usuarios", userRoute);
  }

  async startServer() {
    try {
      await sequelize.authenticate(); // Verifique a conexão com o banco de dados
      console.log('Connection has been established successfully.');
      await sequelize.sync();
      const PORT = process.env.PORT || 3000; // Use a porta do ambiente ou padrão 3000
      this.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1); // Opcional: encerra o processo se a conexão falhar
    }
  }
}

export default Server;