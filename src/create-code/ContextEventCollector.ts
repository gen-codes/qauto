import Debug from 'debug';
import { EventEmitter } from 'events';
import { BrowserContext, ChromiumBrowserContext } from 'playwright';
import { loadConfig } from '../config';
import { ElementEvent } from '../types';
import {
  forEachPage,
  IndexedPage,
  indexPages,
  initEvaluateScript,
} from '../utils';
import { NavigationListener } from './NavigationListener'
import { QAWolfWeb } from '../web';
import { addScriptToContext } from '../web/addScript';
import * as actions from '../actions';
const debug = Debug('qawolf:ContextEventCollector');

export class ContextEventCollector extends EventEmitter {
  public static async create(
    context: BrowserContext,
  ): Promise<ContextEventCollector> {
    await addScriptToContext(context);
    await indexPages(context);
    return new ContextEventCollector(context);
  }

  private _attribute: string;

  protected constructor(context) {
    super();

    this._attribute = loadConfig().attribute;

    forEachPage(context, (page) =>
      this._collectPageEvents(context, page as IndexedPage),
    );
  }

  private async _collectPageEvents(context: BrowserContext, page: IndexedPage): Promise<void> {
    if (page.isClosed()) return;

    const index = page.createdIndex;
    debug(`collect page events ${index} ${this._attribute}`);

    await page.exposeFunction('cp_collectEvent', (event: ElementEvent) => {
      debug(`emit %j`, event);
      this.emit('elementevent', event);
    });
    const emit = this.emit.bind(this)
    Object.values(actions).forEach((action)=>{
      if(action.host){
        action.host(page, function(e){emit('elementevent', e)}, context)
      }
    })
    
    await initEvaluateScript(
      page,
      ({ attribute, pageIndex }) => {
        const web: QAWolfWeb = (window as any).qawolf;

        new web.PageEventCollector({
          attribute,
          pageIndex,
          sendEvent: (window as any).cp_collectEvent,
        });
      },
      {
        attribute: this._attribute,
        pageIndex: index,
      },
    );
  }
}
