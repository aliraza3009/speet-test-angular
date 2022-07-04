import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DownloaderService } from '../downloader.service';

type Conditions = 'START' | 'RUNNING' | 'STOPPED';

@Component({
  selector: 'app-speed-test',
  templateUrl: './speed-test.component.html',
  styleUrls: ['./speed-test.component.scss'],
})
export class SpeedTestComponent implements OnInit {
  constructor(
    private downloadService: DownloaderService,
    private http: HttpClient
  ) {}

  // initial value of testState will be "START"
  testState: Conditions = 'START';

  // vars for calculating Speed
  totalSize: number = 41943040;
  percentDownloaded: number = 0;
  startTime: any = new Date().getTime();
  endTime: any;
  currTime: any;
  prevTime: any;
  speed: number = 0;
  bytesDownloaded: number = 0;
  prevBytesDownloaded: number = 0;
  speedUnit: string = 'Mbps';
  timeCompleted: number = 0;

  startTest() {
    // setting test state as RUNNING
    this.testState = 'RUNNING';

    // vars with initials values
    this.percentDownloaded = 0;
    this.bytesDownloaded = 0;
    this.prevBytesDownloaded = 0;

    this.downloadService.downloadFile().subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        // if file size from event.total not undefined then get file size value
        if (event.total !== undefined) {
          this.totalSize = event.total;
        }

        // initial time
        if (this.percentDownloaded === 0) {
          this.startTime = this.prevTime = new Date().getTime();
        }

        // Downloaded bytes & percentage at current Time
        this.currTime = new Date().getTime();
        this.bytesDownloaded = event.loaded / 1000000;
        this.percentDownloaded = Math.round(
          (100 * event.loaded) / this.totalSize
        );

        // speed calculation based on bytes downloaded and time passed
        this.speed =
          (this.bytesDownloaded - this.prevBytesDownloaded) /
          ((this.currTime - this.prevTime) / 1000);

        // If current speed is below 1 Mbps then change speed unit to Kbps and
        // speed value * 1000 as 1000 Kb = 1 Mb. otherwise keep Mbps
        if (this.speed < 1) {
          this.speedUnit = 'Kbps';
          this.speed *= 1000;
        } else this.speedUnit = 'Mbps';

        // Updating previous time & bytes downloaded with current for next iteration
        this.prevTime = this.currTime;
        this.prevBytesDownloaded = this.bytesDownloaded;

        // Average speed calculation when file download completed
        if (this.percentDownloaded === 100) {
          // setting test state as RUNNING
          this.testState = 'STOPPED';
          this.endTime = new Date().getTime();
          this.timeCompleted = (this.endTime - this.startTime) / 1000;
          this.speed = this.totalSize / this.timeCompleted / 1000000;
          if (this.speed < 1) {
            this.speedUnit = 'Kbps';
            this.speed *= 1000;
          } else this.speedUnit = 'Mbps';
        }
      }
    });
  }

  stopTest() {
    this.testState = 'STOPPED';
    console.log(`Hi the test is ${this.testState}`);
  }

  ngOnInit(): void {}
}
