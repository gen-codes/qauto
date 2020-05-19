// import Debug from 'debug';
import { ElementEvent, Step } from '../types';

// const debug = Debug('qawolf:buildstepSteps');

const filterStepEvents = (events: ElementEvent[]): ElementEvent[] => {
  return events.filter((event, i) => {
    // track original event index
    (event as any).index = i;

    if (['step'].includes(event.name)) return true;
    return false
  });
};


export const buildStepSteps = (events: ElementEvent[]): Step[] => {
  const stepEvents = filterStepEvents(events);
  const steps: Step[] = [];

  stepEvents.forEach((event) => {
    steps.push({
      action: 'step',
      index: steps.length,
      event: event,
    });
  });

  return steps;
};
