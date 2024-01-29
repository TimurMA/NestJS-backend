import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

config({ path: '../.env' });

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: +process.env.POSTGRES_PORT || 5435,
        database: process.env.POSTGRES_DATABASE || 'database',
        username: process.env.POSTGRES_USERNAME || 'username',
        password: process.env.POSTGRES_PASSWORD || 'password',
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
