// import Debug from 'debug';
import { ElementEvent, Step } from '../types';

// const debug = Debug('qawolf:buildNavigationSteps');

const filterNavigationEvents = (events: ElementEvent[]): ElementEvent[] => {
  return events.filter((event, i) => {
    // track original event index
    (event as any).index = i;

    // ignore other actions
    if (['goto', 'goforward', 'goback'].includes(event.name)) return true;
    return false

  });
};


export const buildNavigationSteps = (events: ElementEvent[]): Step[] => {
  const navigationEvents = filterNavigationEvents(events);
  const steps: Step[] = [];

  navigationEvents.forEach((event) => {
    console.log(event)
    steps.push({
      action: 'navigation',
      index: steps.length,
      event: {name: event.name, value: event.value},
    });
  });

  return steps;
};
