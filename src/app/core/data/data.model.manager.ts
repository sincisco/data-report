import {Dataset, DatasetWrapper} from './data.model.interface';

/**
 * 该类不可以跟DataSourceManager合并
 */
class DataModelManager {
  private _map: Map<string, DatasetWrapper> = new Map();
  private _currentDatasetWrapper: DatasetWrapper;

  addDataset(name: string, displayName: string, dataset: Dataset) {
    this._map.set(displayName, {
      name,
      displayName,
      state: {collapsedDimension: false, collapsedMeasure: false}
    });
    return this;
  }

  get list(): Array<string> {
    const retArray = [];
    this._map.forEach((value: DatasetWrapper, key, map) => {
      retArray.push(value.displayName);
    });
    return retArray;
  }

  has(name: string): boolean {
    return this._map.has(name);
  }

  getDataset(name: string): DatasetWrapper {
    return this._currentDatasetWrapper = this._map.get(name);
  }

  get current(): Dataset {
    return null; // this._currentDatasetWrapper ? this._currentDatasetWrapper.dataset : null;
  }

  getDefaultDataset(): DatasetWrapper {
    return null; // this._map.entries().next().value[1];
  }
}

export const dataModelManager = new DataModelManager();
