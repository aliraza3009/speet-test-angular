import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DownloaderService {
  fileUrl: string = 'assets/testfile.dat';
  constructor(private http: HttpClient) {}

  downloadFile() {
    const request = new HttpRequest('GET', this.fileUrl, {
      headers: new Headers({
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
      reportProgress: true,
      responseType: 'blob',
    });

    return this.http.request(request);
  }
}
