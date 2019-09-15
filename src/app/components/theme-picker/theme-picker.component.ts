import { Component, OnInit, HostListener, ElementRef, Input, ComponentRef, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'webui-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit {

  @Input() componentRef: ComponentRef<ThemePickerComponent>;
  @Input() currentTheme: string;
  @Output() themeChanger: EventEmitter<string> = new EventEmitter();

  creationDate: Date;

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    let eventDate: Date = new Date(Date.now());
    if (this.creationDate.valueOf() + 300 < eventDate.valueOf()) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.componentRef.destroy();
      }
    }
  }

  constructor(private eRef: ElementRef) { }

  ngOnInit() {
    this.creationDate = new Date(Date.now());
  }

  setTheme(themeName: string) {
    this.themeChanger.emit(themeName);
    this.componentRef.destroy();
  }

}
