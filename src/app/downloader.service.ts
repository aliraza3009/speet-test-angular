import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DownloaderService {
  fileUrl: string = 'assets/testfile.dat?v=' + new Date().getTime();
  constructor(private http: HttpClient) {}

  downloadFile() {
    const request = new HttpRequest('GET', this.fileUrl, {
      reportProgress: true,
      responseType: 'blob',
    });

    return this.http.request(request);
  }
}
