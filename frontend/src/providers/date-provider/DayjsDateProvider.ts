import { IDateProvider } from './IDateProvider'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export class DayjsDateProvider implements IDateProvider {
  private static _instance = new DayjsDateProvider()

  constructor() {
    if (DayjsDateProvider._instance) {
      throw new Error(
        'Erro ao criar instância do DayjsDateProvider. Execute getInstance() para criar uma nova',
      )
    }

    DayjsDateProvider._instance = this
  }

  public static getInstance(): DayjsDateProvider {
    return DayjsDateProvider._instance
  }

  endDay(date: Date): Date {
    return dayjs(date).endOf('day').toDate()
  }

  compareInHours(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate)
    const startDateUTC = this.convertToUTC(startDate)

    return dayjs(endDateUTC).diff(startDateUTC, 'hours')
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const endDateUTC = this.convertToUTC(endDate)
    const startDateUTC = this.convertToUTC(startDate)

    return dayjs(endDateUTC).diff(startDateUTC, 'days')
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format()
  }

  dateNow(): Date {
    return dayjs().toDate()
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate()
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hours').toDate()
  }

  compareBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate)
  }
}
