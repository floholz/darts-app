import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {VirtualKeyComponent} from "../virtual-key/virtual-key.component";
import {KBCode} from "../../models/kb-code";

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

  @ViewChild('key2x', { static: false }) key2x!: VirtualKeyComponent;
  @ViewChild('key3x', { static: false }) key3x!: VirtualKeyComponent;

  protected readonly Key = KBCode;

  @Input() dataFormControl: FormControl<number> = new FormControl();
  @Input() defaultFontSize?: string;
  @Output() onChange = new EventEmitter<string | number>();
  @Output() onKeyPressed = new EventEmitter<KBCode>();
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<boolean>();

  private end$: Subject<void> = new Subject<void>();
  private activeMultiplier: number = 1;

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
    this.onKeyPressed.emit(key);
    this.dataFormControl.patchValue(this.dataFormControl.value*10 + num);
  }

  onMultiplierPressed(state: boolean, multi: number) {
    if (state) {
      this.activeMultiplier = multi;
      if (multi === 2) {
        this.key3x.reset();
      } else if (multi === 3) {
        this.key2x.reset();
      }
    } else {
      this.activeMultiplier = 1;
    }
  }

  onBackspacePressed(key: KBCode): void {
    this.onKeyPressed.emit(key);
    console.log(this.dataFormControl.value, this.dataFormControl.value != null);
    this.onDelete.emit(this.dataFormControl.value != null);

    const value = Math.floor(this.dataFormControl.value/10);
    if (value === 0) {
      this.resetToggleKeys();
      this.dataFormControl.reset();
    } else {
      this.dataFormControl.patchValue(value);
    }
  }

  onEnterPressed(key: KBCode): void {
    this.dataFormControl.patchValue(this.dataFormControl.value*this.activeMultiplier);
    this.resetToggleKeys();
    this.onKeyPressed.emit(key);
    this.onSubmit.emit();
  }

  private resetToggleKeys() {
    this.key2x.reset();
    this.key3x.reset();
    this.activeMultiplier = 1;
  }
}
