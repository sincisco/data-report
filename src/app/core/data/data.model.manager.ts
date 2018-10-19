import {Dataset, DataModel} from './data.model.interface';
import {DataOptionSet} from '@core/data/data.option.set';

/**
 * 该类不可以跟DataSourceManager合并 DataModelPlugin只认DataModelManager说话
 * 切换Graphic
 */
class DataModelManager {
  private _map: Map<string, DataModel> = new Map();
  private _currentDatasetWrapper: DataModel;

  private _dataOptionSet: DataOptionSet;

  set detaOptionSet(value: DataOptionSet) {
    if (value) {
      this._dataOptionSet.dataOptionArray.forEach((dataOption) => {
        this.addDataModel(dataOption.id, dataOption.displayName);
      });
      this._dataOptionSet = value;
    }
  }

  updateState(dataModelType: string, dataModelID: string) {

  }

  addDataModel(id: string, displayName: string) {
    this._map.set(id, {
      id,
      displayName,
      state: {collapsedDimension: false, collapsedMeasure: false}
    });
    return this;
  }

  get list(): Array<{ id: string, displayName: string }> {
    const retArray = [];
    this._map.forEach((value: DataModel, key, map) => {
      retArray.push({
        id: value.id,
        displayName: value.displayName
      });
    });
    return retArray;
  }

  has(id: string): boolean {
    return this._map.has(id);
  }

  getDataModel(id: string): DataModel {
    return this._currentDatasetWrapper = this._map.get(id);
  }

  clear() {

  }

  get current(): Dataset {
    return null; // this._currentDatasetWrapper ? this._currentDatasetWrapper.dataset : null;
  }

  getDefaultDataset(): DataModel {
    return null; // this._map.entries().next().value[1];
  }
}

export const dataModelManager = new DataModelManager();
