import { buildStepLines } from './buildStepLines';
import { Step } from '../types';
import { VirtualCode } from './VirtualCode';
import * as actions from '../actions'
export const buildVirtualCode = (steps: Step[]): VirtualCode => {
  let previous: Step = null;
  const lines: string[] = [];
  Object.values(actions).forEach(action=>{
    if(action.rereduce){
      steps = action.rereduce(steps)
    }
  })
  steps.forEach(step => {
    lines.push(...buildStepLines(step, previous));
    previous = step;
  });

  return new VirtualCode(lines);
};
