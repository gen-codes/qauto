import { concat, sortBy } from 'lodash';
import { buildClickSteps } from './buildClickSteps';
import { buildKeySteps } from './buildKeySteps';
import { buildScrollSteps } from './buildScrollSteps';
import { buildNavigationSteps } from './buildNavigationSteps';
import { buildStepSteps } from './buildStepSteps';
import { buildSelectOptionSteps } from './buildSelectOptionSteps';
import { ElementEvent, Step } from '../types';

export const buildSteps = (events: ElementEvent[]): Step[] => {
  const unorderedSteps = concat(
    buildClickSteps(events),
    buildKeySteps(events),
    buildScrollSteps(events),
    buildSelectOptionSteps(events),
    buildNavigationSteps(events),
    buildStepSteps(events)
  );

  let steps = sortBy(
    unorderedSteps,
    // ordered by the event time
    (step) => step.event.time,
  );

  // reindex
  steps = steps.map((step, index) => ({
    ...step,
    index,
  }));

  return steps;
};
