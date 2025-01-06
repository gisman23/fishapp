import { Pipe, PipeTransform } from '@angular/core';
import { BoundingBox } from '../models/boundingBox';

@Pipe({
  name: 'bboxFilter',
  standalone: true
})
export class BboxFilterPipe implements PipeTransform {
  transform(items: any[], bbox: BoundingBox): any[] {
    if (!items || !bbox) {
      return items;
    }

    const filteredItems = items.filter(item => {
      return item.Location[1] >= bbox.minLat && item.Location[1] <= bbox.maxLat &&
             item.Location[0] >= bbox.minLng && item.Location[0] <= bbox.maxLng;
      });

      /* Unique CatchDate's */
      return filteredItems.filter((obj, index, self) => {
        return index === self.findIndex(o => o["CatchDate"] === obj["CatchDate"]);
      });
  }
}