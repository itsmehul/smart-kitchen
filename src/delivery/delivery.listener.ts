import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/common.constants';
import { Order } from 'src/kitchen/entities/order.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class DeliveryListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(EVENTS.ORDER_COMPLETED_FOR_GROUP)
  handleOrderCompletionForGroup({ orders }: { orders: Order[] }) {
    //create delivery and boxes for all orders
  }
}
