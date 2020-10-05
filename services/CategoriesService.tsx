import BaseService, { IService } from './BaseService';
import {
  getList,
  getListToRemove,
  getListToSave,
  setList,
  setListToRemove,
  setListToSave
} from '../features/categories/CategoriesSlice';
import { CategoryModel } from '../models/CategoryModel';
import { store } from '../store';

/**
 * TransactionsService
 * A service to handle the category's state persistence
 *
 * @extends BaseService
 */
export default class CategoriesService extends BaseService implements IService {

  protected list: CategoryModel[];
  protected listToSave: CategoryModel[];
  protected listToRemove: CategoryModel[];

  constructor() {
    super();
    this.syncFromStore();
  }

  /**
   * Store the categories' lists
   */
  store() {
    store.dispatch(setList(this.list));
    store.dispatch(setListToSave(this.listToSave));
    store.dispatch(setListToRemove(this.listToRemove));
  }

  /**
   * Exchange the current categories' lists with the stored list
   */
  syncFromStore() {
    this.list = [...getList(store.getState())];
    this.listToSave = [...getListToSave(store.getState())];
    this.listToRemove = [...getListToRemove(store.getState())];
  }

  /**
   * Retrieves the stored categories' list
   */
  get(): CategoryModel[] {

    return this.list;
  }

  /**
   * Set the list of categories
   * @param list
   */
  set(list: CategoryModel[]): void {
    this.list = (list)? list : [];
  }

  /**
   * Add a new category on the current list
   * @param newCategory
   */
  add(newCategory: CategoryModel): void {

    this.list.push({...newCategory});
    this.listToSave.push({...newCategory});

    this.store();
  }

  /**
   * Update the category on the current list
   * @param category
   */
  update(category: CategoryModel): void {

    const index = this.findSameCategoryIndex(category);
    this.list[index] = {...category};

    const indexToSave = this.findSameCategoryIndex(category, this.listToSave);
    if (indexToSave >= 0) {
      this.listToSave[indexToSave] = {...category};
    } else {
      this.listToSave.push({...category});
    }

    this.store();
  }

  /**
   * Remove a category from the current list
   * @param categoryToRemove
   */
  remove(categoryToRemove: CategoryModel): void {
    const categoryToRemoveIndex = this.findSameCategoryIndex(categoryToRemove, this.listToSave);
    const removedCategory = this.list.splice(categoryToRemoveIndex, 1)[0];
    this.removeFromListToSave(removedCategory);
    if (removedCategory.id) {
      this.listToRemove.push(removedCategory);
    }

    this.store();
  }

  /**
   * Remove a given category from the list of categories to save
   * @param categoryToRemove
   * @private
   */
  private removeFromListToSave(categoryToRemove: CategoryModel): void {
    const toRemoveIndex = this.findSameCategoryIndex(categoryToRemove, this.listToSave);
    if (toRemoveIndex >= 0) {
      this.listToSave.splice(toRemoveIndex, 1);
    }
  }

  /**
   * Retrieve a category index of a given list of categories
   * @param categoryToFind
   * @param list
   * @private
   */
  private findSameCategoryIndex(categoryToFind: CategoryModel, list: CategoryModel[] = this.list): number {
    const categoryToFindJSON = JSON.stringify(categoryToFind);
    return (list.length)? list.findIndex((category) => {
      return JSON.stringify(category) === categoryToFindJSON
    }) : -1;
  }
}