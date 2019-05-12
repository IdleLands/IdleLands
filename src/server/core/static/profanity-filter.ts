
import { CensorSensor } from 'censor-sensor';

const censorSensor = new CensorSensor();
censorSensor.disableTier(2);
censorSensor.disableTier(4);

export { censorSensor };
