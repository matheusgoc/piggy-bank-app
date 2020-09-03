export interface IService {
  store(): void
  syncFromStore(): void
  get(): any,
  set(model: any): void,
}

export default class BaseService {

}