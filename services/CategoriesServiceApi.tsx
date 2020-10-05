import CategoriesService from './CategoriesService';
import { CategoryModel } from '../models/CategoryModel';

/**
 * CategoriesServiceApi
 * A service to handle the category's persistence at the API web service
 *
 * @extends CategoriesService
 */
export default class CategoriesServiceApi extends CategoriesService {

  constructor() {
    super();
  }

  /**
   * Load the user's categories
   */
  async load(): Promise<void> {
    try {

      const res = await this.api.get('categories');
      this.list = res.data.map((item): CategoryModel => {
        return this.mapToStore(item);
      });

    } catch(error) {

      const method = 'CategoriesServiceApi.load';
      const msg = 'Unable to retrieve categories from the server';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Search for categories
   */
  async search(search: string): Promise<CategoryModel[]> {
    try {

      const res = await this.api.get('categories/search/' + search);

      return res.data.map((item): CategoryModel => {
        return this.mapToStore(item);
      });

    } catch(error) {

      const method = 'CategoriesServiceApi.load';
      const msg = 'Unable to retrieve categories from the server';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Persist the categories on the list to save
   */
  async save():Promise<void> {

    const categoriesToSave = this.listToSave.map((category) => {
      return this.mapToApi(category);
    });

    try {

      await this.api.post('categories', categoriesToSave);
      this.listToSave = [];
      this.store();

    } catch (error) {

      const method = 'CategoriesServiceApi.save';
      let msg = 'Unable to save the category due to a server error. Try again later!';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Remove the category
   */
  async delete():Promise<void> {

    const idsToRemove = this.listToRemove.map((category) => {
      return category.id;
    }).join(',');

    try {

      await this.api.delete('categories/' + idsToRemove);
      this.listToRemove = [];
      this.store();

    } catch (error) {

      const method = 'CategoriesServiceApi.delete';
      let msg = 'Unable to remove the category due to a server error. Try again later!';
      this.handleHttpError(method, msg, error);
    }
  }

  /**
   * Format category to save it in the server
   *
   * @private
   */
  private mapToApi(category: CategoryModel): object {
    return {
      id: category.id,
      name: category.name,
    }
  }

  /**
   * Format a category's data comes from the server to a CategoryModel
   *
   * @param category
   * @private
   */
  private mapToStore(category): CategoryModel {
    return {
      id: category['id'],
      name: category['name'],
      isNew: false,
    }
  }
}