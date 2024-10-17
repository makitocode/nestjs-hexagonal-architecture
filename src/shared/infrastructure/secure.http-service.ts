import { Environment } from "../../config/environments";
import { Result } from "../domain/result";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosRequestConfig } from "axios";

export class SecureHttpServiceError {
  status: number;
  statusText: string;
  detailedMessage: string;
}

interface HttpRequestConfig<RequestData> {
  url: string;
  token?: string;
  data?: RequestData;
  options?: AxiosRequestConfig;
}

@Injectable()
export class SecureHttpService {
  /**
   * The logger instance.
   * @private
   */
  private readonly logger = new Logger(SecureHttpService.name);

  /**
   * The base URL for the Leaseville API.
   * @private
   */
  private readonly apiBaseUrl: string;

  /**
   * The API token for the Leaseville API.
   * @private
   */
  private readonly token: string;

  /**
   * Constructor.
   */
  constructor(private readonly configService: ConfigService<Environment>) {
    this.apiBaseUrl = this.configService.get<string>("LEASEVILLE_API_BASE_URL");
    this.token = this.configService.get<string>("LEASEVILLE_API_TOKEN");
  }

  /**
   * Makes a secure request to the Leaseville API.
   * @param config
   * @param method
   * @private
   */
  private async request<ResponseData, RequestData>(config: HttpRequestConfig<RequestData>, method: string): Promise<Result<ResponseData>> {
    const token = config.token || this.token;

    const options: AxiosRequestConfig = {
      ...config.options,
      headers: {
        ...config.options?.headers,
        Authorization: `Bearer ${token}`,
      },
      method,
      url: `${this.apiBaseUrl}${config.url}`,
      data: config.data,
    };

    try {
      this.logger.debug(`request( [${method}] ${options.url}, Headers: ${JSON.stringify(options.headers)} )`);
      const response = await axios.request<ResponseData>(options);
      return Result.ok(response.data);
    } catch (error) {
      const simpleErrorMsg: string = error.message || "An error occurred.";
      const detailedErrorMsg: string = error.response?.data.message;
      this.logger.error(`requestFault( Error in request. Error: ${simpleErrorMsg}: Detailed Error: ${detailedErrorMsg} )`);
      const errorResponse: SecureHttpServiceError = {
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Internal Server Error",
        detailedMessage: detailedErrorMsg || simpleErrorMsg,
      };
      return Result.fail(errorResponse);
    }
  }

  /**
   * Makes a GET request to the Leaseville API.
   * @param config
   */
  public async get<ResponseData>(config: HttpRequestConfig<null>): Promise<Result<ResponseData>> {
    return this.request<ResponseData, null>(config, "GET");
  }

  /**
   * Makes a POST request to the Leaseville API.
   * @param config
   */
  public async post<ResponseData, RequestData>(config: HttpRequestConfig<RequestData>): Promise<Result<ResponseData>> {
    return this.request<ResponseData, RequestData>(config, "POST");
  }

  /**
   * Makes a PUT request to the Leaseville API.
   * @param config
   */
  public async put<ResponseData, RequestData>(config: HttpRequestConfig<RequestData>): Promise<Result<ResponseData>> {
    return this.request<ResponseData, RequestData>(config, "PUT");
  }

  /**
   * Makes a PATCH request to the Leaseville API.
   * @param config
   */
  public async patch<ResponseData, RequestData>(config: HttpRequestConfig<RequestData>): Promise<Result<ResponseData>> {
    return this.request<ResponseData, RequestData>(config, "PATCH");
  }

  /**
   * Makes a DELETE request to the Leaseville API.
   * @param config
   */
  public async delete<ResponseData>(config: HttpRequestConfig<null>): Promise<Result<ResponseData>> {
    return this.request<ResponseData, null>(config, "DELETE");
  }
}
