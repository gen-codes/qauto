import Debug from 'debug';
import { BrowserContext } from 'playwright-core';
import { CodeFileUpdater } from './CodeFileUpdater';
import { ContextEventCollector } from './ContextEventCollector';
import { createPrompt } from './createPrompt';
import { ElementEvent } from '../types';
import * as actions from '../actions';

type CreateCliOptions = {
  codePath: string;
  context: BrowserContext;
};

type ConstructorOptions = {
  codeUpdater: CodeFileUpdater;
  collector: ContextEventCollector;
};

const debug = Debug('qawolf:CreateManager');

export class CreateManager {
  public static async create(
    options: CreateCliOptions,
  ): Promise<CreateManager> {
    debug(`create code at ${options.codePath}`);

    const codeUpdater = await CodeFileUpdater.create(options.codePath);

    const collector = await ContextEventCollector.create(options.context);

    const manager = new CreateManager({
      codeUpdater,
      collector,
    });

    return manager;
  }

  private _codeUpdater: CodeFileUpdater;
  private _collector: ContextEventCollector;
  private _events: ElementEvent[] = [];

  protected constructor(options: ConstructorOptions) {
    this._codeUpdater = options.codeUpdater;
    this._collector = options.collector;

    this._collector.on('elementevent', (event) => this.update(event));
  }

  protected async update(event: ElementEvent): Promise<void> {
    const action = actions[event.name]
    if(action && action.reduce){
      this._events = action.reduce(this._events, event)
    }else{
      this._events.push(event);
    }
    // const steps = buildSteps(this._events);
    await this._codeUpdater.update({ steps:this._events });
  }

  public async finalize(): Promise<void> {
    const boundCreatePrompt = createPrompt.bind(this)
    const shouldSave = await boundCreatePrompt(this._codeUpdater.path(), this.update.bind(this));

    if (shouldSave) {
      await this._codeUpdater.update({ steps: this._events });
      await this._codeUpdater.finalize();
    } else {
      await this._codeUpdater.discard();
    }
  }
}
