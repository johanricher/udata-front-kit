import axios from 'axios'
import { toast } from 'vue3-toastify'

import config from '@/config'

import type {
  DatagouvfrAPIArgs,
  AxiosResponseData,
  RequestConfig,
  AxiosError,
  GetParams,
  UpdateParams,
  ListParams,
  CreateParams,
  DeleteParams
} from '../../model/api'

export const toastError = (error: AxiosError): void => {
  const msg = `${error.message} (${error.response?.status})`
  toast(msg, { type: 'error', autoClose: false })
}

/**
 * A wrapper around data.gouv.fr's API
 *
 * This class must be subclassed to provide at least an `endpoint` attr,
 * e.g. OrganizationsAPI will declare `endpoint = organizations`.
 */
export default class DatagouvfrAPI {
  baseUrl = `${config.datagouvfr.base_url}/api`
  version = 1
  endpoint = ''
  toasted = true

  constructor(args: DatagouvfrAPIArgs = {}) {
    const { baseUrl, version, endpoint } = args
    this.baseUrl = baseUrl ?? this.baseUrl
    this.version = version ?? this.version
    this.endpoint = endpoint ?? this.endpoint
  }

  url(suffixed: boolean = false): string {
    return `${this.baseUrl}/${this.version}/${this.endpoint}${
      suffixed ? '/' : ''
    }`
  }

  /**
   * Make a `method` request to URL and optionnaly attach a toaster to the error
   */
  async request(requestConfig: RequestConfig): Promise<AxiosResponseData> {
    const response = await axios(requestConfig).catch((error: AxiosError) => {
      if (this.toasted && requestConfig.toasted === true) {
        toastError(error)
      }
      throw error
    })
    return response.data
  }

  /**
   * Get an entity's detail from its id
   */
  async get({
    entityId,
    params,
    headers,
    toasted = true,
    authenticated = false,
    redirectNotFound = false
  }: GetParams): Promise<AxiosResponseData> {
    const url = `${this.url()}/${entityId}/`
    return await this.request({
      url,
      method: 'get',
      params,
      headers,
      toasted,
      authenticated,
      redirectNotFound
    })
  }

  /**
   * List entities
   */
  async list({
    params,
    headers,
    toasted = true,
    authenticated = false
  }: ListParams): Promise<AxiosResponseData> {
    return await this.request({
      url: this.url(true),
      method: 'get',
      params,
      headers,
      toasted,
      authenticated
    })
  }

  /**
   * Create an entity (POST)
   */
  async create({
    data,
    headers,
    toasted = true,
    authenticated = true
  }: CreateParams): Promise<AxiosResponseData> {
    return await this.request({
      url: this.url(true),
      method: 'post',
      data,
      headers,
      toasted,
      authenticated
    })
  }

  /**
   * Update an entity (PUT)
   */
  async update({
    entityId,
    data,
    headers,
    toasted = true,
    authenticated = true
  }: UpdateParams): Promise<AxiosResponseData> {
    const url = `${this.url()}/${entityId}/`
    return await this.request({
      url,
      method: 'put',
      data,
      headers,
      toasted,
      authenticated
    })
  }

  /**
   * Delete an entity (DELETE)
   */
  async delete({
    entityId,
    headers,
    toasted = true,
    authenticated = true
  }: DeleteParams): Promise<AxiosResponseData> {
    const url = `${this.url()}/${entityId}/`
    return await this.request({
      url,
      method: 'delete',
      headers,
      toasted,
      authenticated
    })
  }
}
