import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

type Result<T> = {
  code: number;
  message: string;
  result: T;
};

export class Request {
  instance: AxiosInstance;

  baseConfig: AxiosRequestConfig = {
    baseURL: "https://iot-term-project-server.onrender.com",
    timeout: 60000,
  };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data;
      },
      (err: any) => {
        // 这里用来处理http常见错误，进行全局提示
        return Promise.reject(err.response);
      }
    );
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return this.instance.delete(url, config);
  }
}

export default new Request({});
