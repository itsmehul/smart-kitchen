import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { getSqljsManager } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DeliveryModule } from './delivery/delivery.module';
import { Bowl } from './delivery/entities/bowl.entity';
import { Box } from './delivery/entities/box.entity';
import { Delivery } from './delivery/entities/delivery.entity';
import { Action } from './inventory/entities/action.entity';
import { Ingredient } from './inventory/entities/ingredient.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { Storage } from './inventory/entities/storage.entity';
import { InventoryModule } from './inventory/inventory.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from './jwt/jwt.module';
import { Forecast } from './kitchen/entities/forecast.entity';
import { Kitchen } from './kitchen/entities/kitchen.entity';
import { Lane } from './kitchen/entities/lane.entity';
import { Order } from './kitchen/entities/order.entity';
import { KitchenModule } from './kitchen/kitchen.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { Menu } from './menu/entities/menu.entity';
import { MenuDish } from './menu/entities/menuDish.entity';
import { MenuModule } from './menu/menu.module';
import { Category } from './recipe/entities/category.entity';
import { Cookbook } from './recipe/entities/cookbook.entity';
import { Recipe } from './recipe/entities/recipe.entity';
import { RecipeIngredient } from './recipe/entities/recipe_ingredient';
import { Station } from './recipe/entities/station.entity';
import { Step } from './recipe/entities/step.entity';
import { RecipeModule } from './recipe/recipe.module';
import { Scheduledtask } from './scheduledtask/entities/scheduledtask.entity';
import { ScheduledtaskModule } from './scheduledtask/scheduledtask.module';
import { SmsModule } from './sms/sms.module';
import { SupplierModule } from './supplier/supplier.module';
import { TiramizooPackage } from './tiramizoo/entities/package.entity';
import { TiramizooOrder } from './tiramizoo/entities/tiramizoo.entity';
import { TiramizooModule } from './tiramizoo/tiramizoo.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { UsersModule } from './users/users.module';

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
        TIRAMIZOO_URL: Joi.string().required(),
        TIRAMIZOO_API_TOKEN: Joi.string().required(),
        TIRAMIZOOWEBHOOKURL: Joi.string().required(),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      timezone: '+00:00',
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
        Box,
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
        Delivery,
        Category,
        Station,
        RecipeIngredient,
        Lane,
        Scheduledtask,
        Bowl,
        MenuDish,
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
    TiramizooModule.forRoot({
      tiramizooUrl: process.env.TIRAMIZOO_URL,
      apiKey: process.env.TIRAMIZOO_API_TOKEN,
      tiramizooWebhookUrl: process.env.TIRAMIZOOWEBHOOKURL,
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
    InventoryModule,
    SupplierModule,
    DeliveryModule,
    ScheduledtaskModule,
    RecipeModule,
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

  async onModuleInit() {
    // Save dates in UTC in database
    await getSqljsManager().query(`SET GLOBAL time_zone = '+00:00';`);
    await getSqljsManager().query(`SET time_zone = '+00:00';`);
  }
}
