import { Singleton, AutoWired } from 'typescript-ioc';

export enum Holiday {
  Valentine = 'valentine',
  Leprechaun = 'leprechaun',
  Eggs = 'eggs',
  Anniversary = 'anniversary',
  Fireworks = 'fireworks',
  School = 'school',
  Hallows = 'hallows',
  Turkeys = 'turkeys',
  Winter = 'winter'
}

@Singleton
@AutoWired
export class HolidayHelper {

  // fuck leap years
  private holidays = {
    valentine: {
      start: new Date('Feb 1'),
      end:   new Date('Feb 28')
    },
    leprechaun: {
      start: new Date('Mar 1'),
      end:   new Date('Mar 31')
    },
    eggs: {
      start: new Date('Apr 1'),
      end:   new Date('Apr 30')
    },
    anniversary: {
      start: new Date('Jun 1'),
      end:   new Date('Jun 30')
    },
    fireworks: {
      start: new Date('Jul 1'),
      end:   new Date('Jul 31')
    },
    school: {
      start: new Date('Sep 1'),
      end:   new Date('Sep 30')
    },
    hallows: {
      start: new Date('Oct 1'),
      end:   new Date('Oct 31')
    },
    turkeys: {
      start: new Date('Nov 1'),
      end:   new Date('Nov 31')
    },
    winter: {
      start: new Date('Dec 1'),
      end:   new Date('Dec 31')
    }
  };

  public isHoliday(holiday: Holiday): boolean {
    const holidayRef = this.holidays[holiday];
    if(!holidayRef) return false;

    const { start, end } = holidayRef;
    const today = new Date();
    return today.getMonth() >= start.getMonth()
        && today.getDate()  >= start.getDate()
        && today.getMonth() <= end.getMonth()
        && today.getDate()  <= end.getDate();
  }
}
