import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { BoxService } from 'src/delivery/box.service';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { entitiesToSave } from 'src/utils/misc';
import { Scheduledtask, TaskType } from './entities/scheduledtask.entity';
import { ScheduledtaskService } from './scheduledtask.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduledtask]), DeliveryModule],
  providers: [ScheduledtaskService],
  exports: [ScheduledtaskService],
})
export class ScheduledtaskModule {
  constructor(
    private readonly scheduledtaskService: ScheduledtaskService,
    private readonly boxService: BoxService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  async onModuleInit() {
    const tasks = await this.scheduledtaskService.getAllScheduledTasks();
    for (const task of tasks) {
      try {
        // failsafe check
        const job = new CronJob(task.executionDateTime, async () => {
          if (task.type === TaskType.BOX) {
            const boxedOrders = await this.boxService.initiateBoxing(
              task.data.kitchenId,
            );
            await entitiesToSave([boxedOrders]);
          }
          this.schedulerRegistry.deleteCronJob(task.cronName);
          await this.scheduledtaskService.deleteScheduledTask(task.cronName);
        });
        this.schedulerRegistry.addCronJob(task.cronName, job);
        job.start();
      } catch (error) {
        await this.scheduledtaskService.deleteScheduledTask(task.cronName);
      }
    }
  }
}
