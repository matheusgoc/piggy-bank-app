import BaseService from './BaseService'
import {
  getGeneralReport,
  getMonthlyReport,
  setGeneralReport,
  setMonthlyReport,
  clearReports,
} from '../features/reports/ReportsSlice'
import { store } from '../store'
import { ReportModel } from '../models/ReportModel'

/**
 * ReportService
 * A service to handle the reports' state persistence
 *
 * @extends BaseService
 */
export default class ReportService extends BaseService {

  protected general: ReportModel
  protected monthly: ReportModel

  constructor() {
    super()
    this.syncFromStore()
  }

  /**
   * Exchange the current reports with the stored ones
   */
  syncFromStore() {
    this.general = {...getGeneralReport(store.getState())}
    this.monthly = {...getMonthlyReport(store.getState())}
  }

  /**
   * Retrieves the General reports
   */
  getGeneral(): ReportModel {

    return this.general
  }

  /**
   * Retrieves the Monthly reports
   */
  getMonthly(): ReportModel {

    return this.monthly
  }

  /**
   * Set the general report
   * @param general
   */
  setGeneral(general: ReportModel): void {
    this.general = general
    this.dispatch(setGeneralReport(this.general))
  }

  /**
   * Set the monthly report
   * @param monthly
   */
  setMonthly(monthly: ReportModel): void {
    this.monthly = monthly
    this.dispatch(setMonthlyReport(this.monthly))
  }

  /**
   * Reset all reports
   */
  clear(): void {
    this.dispatch(clearReports())
  }
}