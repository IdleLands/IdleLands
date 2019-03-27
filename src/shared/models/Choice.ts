
import { extend } from 'lodash';
import * as uuid from 'uuid/v4';

import { IChoice, PartialChoice } from '../interfaces';

export class Choice implements IChoice {

  // internal vars
  public id: string;

  public event: string;
  public foundAt: number;
  public desc: string;
  public choices: string[];
  public defaultChoice: string;

  public extraData?: any;

  init(opts: PartialChoice) {
    extend(this, opts);
    if(!this.id) this.id = uuid();
    if(!this.foundAt) this.foundAt = Date.now();
  }
}
