import { Singleton, AutoWired } from 'typescript-ioc';

@Singleton
@AutoWired
export class CalculatorHelper {

  public calcLevelMaxXP(level: number): number {
    return Math.floor(100 + (50 * Math.pow(level, 1.65)));
  }

}
