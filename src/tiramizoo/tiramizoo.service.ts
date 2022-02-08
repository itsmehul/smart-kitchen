import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { TIRAMIZOO_WEBHOOK_URL } from 'src/common/common.constants';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { BOX_DETAILS, getBoxSize } from 'src/delivery/delivery.constants';
import { Box } from 'src/delivery/entities/box.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Kitchen } from 'src/kitchen/entities/kitchen.entity';
import { Repository } from 'typeorm';
import { TiramizooPackage } from './entities/package.entity';
import { TiramizooOrder } from './entities/tiramizoo.entity';
import { TIME_WINDOWS } from './tiramizoo.constants';
//FIXME: Fetch time windows from tiramizoo API

@Injectable()
export class TiramizooService {
  // @Inject(TIRAMIZOO_WEBHOOK_URL) private readonly webhookUrl: string, // private readonly tiramizooOrder: Repository<TiramizooOrder>, // @InjectRepository(TiramizooOrder) // private readonly tiramizooPackage: Repository<TiramizooPackage>, // @InjectRepository(TiramizooPackage)

  async createOrder(
    kitchen: Kitchen,
    delivery: Delivery,
    boxes: Box[],
  ): Promise<CoreOutput> {
    // const bestTimeWindow = TIME_WINDOWS.find(
    //   (window) =>
    //     DateTime.fromJSDate(delivery.deliveryDateTime) <
    //     DateTime.fromISO(`${DateTime.now().toISODate()} ${window.delivery.to}`),
    // );

    // const deliveryRequirement = delivery.requirements || [
    //   {
    //     type: 'signature',
    //     value: undefined,
    //   },
    // ];

    // this.tiramizooOrder.create({
    //   web_hook_url: this.webhookUrl,
    //   cancellable: true,
    //   description: 'Delivery for company ' + name,
    //   external_id: delivery.external_id,
    //   pickup: {
    //     name: kitchen.name,
    //     email: kitchen.email,
    //     address_line: kitchen.addressLine,
    //     country_code: kitchen.countryCode,
    //     postal_code: kitchen.pinCode,
    //     city: kitchen.city,
    //     phone_number: '',
    //     after: bestTimeWindow.pickup.from,
    //     before: bestTimeWindow.pickup.to,
    //     information: '',
    //   },
    //   delivery: {
    //     name: delivery.name,
    //     email: '',
    //     address_line: delivery.address,
    //     country_code: 'de',
    //     postal_code: delivery.postCode,
    //     city: delivery.city,
    //     phone_number: '',
    //     after: bestTimeWindow.delivery.from,
    //     before: bestTimeWindow.delivery.from,
    //     information: '',
    //     requirements: deliveryRequirement,
    //   },
    //   packages: boxes.map((box) => {
    //     const boxDetails = BOX_DETAILS[getBoxSize(box.size)];
    //     return this.tiramizooPackage.create({
    //       external_id: box.id,
    //       weight: boxDetails.weight,
    //       height: boxDetails.height,
    //       width: boxDetails.width,
    //       length: boxDetails[`length`],
    //       description: boxDetails.description,
    //       size: boxDetails.size,
    //     });
    //   }),
    // });
    return { ok: true };
  }

  // async cancelOrder(): Promise<CoreOutput> {}
}
