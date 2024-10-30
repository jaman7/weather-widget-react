import { environment as env } from 'environment';
import Cookies from 'js-cookie';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { EHttpMethod } from './http.enum';
import { toHttpParams } from './http.utils';
import { IParams } from './http.models';

class HttpService {
  private http: AxiosInstance;
  private baseURL = env.SERVER_API_URL;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || env.SERVER_API_URL;
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
  }

  private get getAuthorization() {
    const accessToken = Cookies.get('AccessToken') || '';
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }

  private setupHeaders(hasAttachment = false) {
    return hasAttachment
      ? { 'Content-Type': 'multipart/form-data', ...this.getAuthorization }
      : { 'Content-Type': 'application/json', ...this.getAuthorization };
  }

  private injectInterceptors(): void {
    this.http.interceptors.request.use(request => {
      return request;
    });
    this.http.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  private normalizeError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  public service() {
    this.injectInterceptors();
    return this;
  }

  private async request<T>(method: EHttpMethod, url: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options,
      });
      return response.data;
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  public async get<T>(url: string, params?: any, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public post<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public put<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public patch<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PATCH, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public delete<T>(url: string, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params,
      headers: this.setupHeaders(hasAttachment),
    });
  }
}

export default HttpService;
