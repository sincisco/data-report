import {IConfigSourceFactory} from '../config.source.factory';
import {BehaviorSubject, of} from 'rxjs';
import {session} from '@core/node/utils/session';

export class RuntimeConfigSourceFactory implements IConfigSourceFactory {
  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new RuntimeConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  private constructor() {
  }

  getConfigSource(configSourceOption: { graphicId: string, graphicKey: string, configOption: any }) {
    const differ = session.differs.find({}).create(), option = configSourceOption.configOption;

    const array = [],
      changes = differ.diff(option);
    if (changes) {
      changes.forEachRemovedItem((record) => {
        console.log('removedItem', JSON.stringify(record.key));
        array.push({
          key: `remove.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      changes.forEachAddedItem((record) => {
        array.push({
          key: `add.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
        console.log('addedItem', JSON.stringify(record.key));
      });
      changes.forEachChangedItem((record) => {
        console.log('changedItem', JSON.stringify(record.key));
        array.push({
          key: record.key,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      array.push({
        key: 'option',
        oldValue: option,
        newValue: option,
        option
      });
    }

    array.push({
      key: 'option',
      newValue: configSourceOption.configOption,
      oldValue: configSourceOption.configOption,
      option: configSourceOption.configOption
    });

    return new BehaviorSubject(array);
  }
}
