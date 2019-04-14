
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Assets {

  @ObjectIdColumn() public _id: string;

  @Column() public stringAssets: any;
  @Column() public objectAssets: any;
  @Column() public mapAssets: any;
  @Column() public mapInformation: any;
}
