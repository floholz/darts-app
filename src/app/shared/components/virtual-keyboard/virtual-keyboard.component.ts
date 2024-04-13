import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {VirtualKeyComponent} from "../virtual-key/virtual-key.component";
import {KBCode} from "../../models/kb-code";
import {PrimeIcons} from "primeng/api";

@Component({
  selector: 'app-virtual-keyboard',
  standalone: true,
  imports: [
    VirtualKeyComponent
  ],
  templateUrl: './virtual-keyboard.component.html',
  styleUrl: './virtual-keyboard.component.scss'
})
export class VirtualKeyboardComponent implements OnInit, OnDestroy {

  protected readonly Key = KBCode;
  protected readonly PrimeIcons = PrimeIcons;

  @Input() dataFormControl: FormControl<number> = new FormControl();
  @Input() defaultFontSize?: string;
  @Output() onChange = new EventEmitter<string | number>();
  @Output() onKeyPressed = new EventEmitter<KBCode>();
  @Output() onSubmit = new EventEmitter<void>();

  private end$: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.dataFormControl.valueChanges
      .pipe(takeUntil(this.end$))
      .subscribe(value => this.onChange.emit(value));
  }

  ngOnDestroy() {
    this.end$.next();
    this.end$.complete();
  }

  onNumberPressed(key: KBCode, num: number) {
    this.dataFormControl.patchValue(this.dataFormControl.value*10 + num);
    this.onKeyPressed.emit(key);
  }

  onBackspacePressed(key: KBCode): void {
    const value = Math.floor(this.dataFormControl.value/10);
    if (value === 0) {
      this.dataFormControl.reset();
    } else {
      this.dataFormControl.patchValue(value);
    }

    this.onKeyPressed.emit(key);
  }

  onEnterPressed(key: KBCode): void {
    this.onKeyPressed.emit(key);
    this.onSubmit.emit();
  }
}
