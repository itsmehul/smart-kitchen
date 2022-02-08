import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { BoxService } from 'src/delivery/box.service';
import { Repository } from 'typeorm';
import { Scheduledtask } from './entities/scheduledtask.entity';

@Injectable()
export class ScheduledtaskService {
  constructor(
    @InjectRepository(Scheduledtask)
    private readonly scheduledTask: Repository<Scheduledtask>,
    private readonly boxService: BoxService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createScheduledTask(
    name: string,
    datetimeOfExecution: Date,
    type: string,
    data: any,
    callback: (data: any) => Promise<void>,
  ): Promise<any> {
    const job = new CronJob(datetimeOfExecution, async () => {
      // this.logger.warn(`time (${seconds}) for job ${name} to run!`);
      await callback(data);
      this.schedulerRegistry.deleteCronJob(name);
      await this.deleteScheduledTask(name);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    await this.scheduledTask.save(
      this.scheduledTask.create({
        executionDateTime: datetimeOfExecution,
        cronName: name,
        type,
        data,
      }),
    );
  }

  async getScheduledTask(name: string): Promise<any> {
    return this.scheduledTask.findOne({ cronName: name });
  }

  async getAllScheduledTasks(): Promise<Scheduledtask[]> {
    return this.scheduledTask.find();
  }

  deleteScheduledTask(name: string): Promise<any> {
    return this.scheduledTask.delete({ cronName: name });
  }
}
