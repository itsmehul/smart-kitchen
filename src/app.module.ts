import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { SmsModule } from './sms/sms.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { UsersModule } from './users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KitchenModule } from './kitchen/kitchen.module';
import { MenuModule } from './menu/menu.module';
import { RecipeModule } from './recipe/recipe.module';
import { InventoryModule } from './inventory/inventory.module';
import { Cookbook } from './recipe/entities/cookbook.entity';
import { Step } from './recipe/entities/step.entity';
import { Recipe } from './recipe/entities/recipe.entity';
import { Ingredient } from './inventory/entities/ingredient.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { Storage } from './inventory/entities/storage.entity';
import { Kitchen } from './kitchen/entities/kitchen.entity';
import { Action } from './inventory/entities/action.entity';
import { Menu } from './menu/entities/menu.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Forecast } from './kitchen/entities/forecast.entity';
import { Order } from './kitchen/entities/order.entity';
import { DeliveryModule } from './delivery/delivery.module';
import { TiramizooModule } from './tiramizoo/tiramizoo.module';
import { TiramizooOrder } from './tiramizoo/entities/tiramizoo.entity';
import { TiramizooPackage } from './tiramizoo/entities/package.entity';
import { Box } from './delivery/entities/box.entity';
import { Delivery } from './delivery/entities/delivery.entity';
import { Category } from './recipe/entities/category.entity';
import { Station } from './recipe/entities/station.entity';
import { RecipeIngredient } from './recipe/entities/recipe_ingredient';

@Module({
  // We add the module and call forRoot to pass configuration setting to root module of GQL
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [
        User,
        Verification,
        Step,
        Recipe,
        Cookbook,
        Ingredient,
        Inventory,
        Storage,
        Kitchen,
        Action,
        Menu,
        Forecast,
        Order,
        TiramizooOrder,
        TiramizooPackage,
        Box,
        Delivery,
        Category,
        Station,
        RecipeIngredient,
      ],
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      cors: {
        origin: '*',
        credentials: true,
      },
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'authorization';
        const token = (
          req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
        )?.split(' ')?.[1];
        return {
          token,
        };
      },
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule,
    AuthModule,
    UsersModule,
    CommonModule.forRoot({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    }),
    MediaModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    SmsModule,
    KitchenModule,
    MenuModule,
    RecipeModule,
    InventoryModule,
    SupplierModule,
    DeliveryModule,
    TiramizooModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/api', method: RequestMethod.GET });
  }
}
