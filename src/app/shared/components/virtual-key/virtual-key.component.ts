import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {KBCode} from "../../models/kb-code";
import {StyleClassModule} from "primeng/styleclass";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-virtual-key',
  standalone: true,
  imports: [
    ButtonModule,
    StyleClassModule
  ],
  templateUrl: './virtual-key.component.html',
  styleUrl: './virtual-key.component.scss'
})
export class VirtualKeyComponent {

  @Input({required: true}) keys!: KBCode;
  @Input() fontSize?: string;
  @Input() text?: string;
  @Input() btnStyle?: "secondary" | "success" | "info" | "warning" | "help" | "danger" | "contrast"
  @Input() icon?: string;
  @Input() iconPos: "left" | "right" | "top" | "bottom" = 'left';
  @Input() iconOnly = false;

  @Input() isToggle = false;
  @Input() toggleStyle?: "secondary" | "success" | "info" | "warning" | "help" | "danger" | "contrast" = "secondary"
  @Input() toggleText?: string;
  @Input() toggleIcon?: string;

  @Output() onKeyPressed = new EventEmitter<KBCode>();
  @Output() onToggled = new EventEmitter<boolean>();

  public toggleState = new BehaviorSubject(false);

  onKey() {
    this.onKeyPressed.emit(this.keys);
    this.toggleState.next(!this.toggleState.value);
    this.onToggled.emit(this.toggleState.value);
  }

  getKeyLabel(): string | undefined {
    if (this.iconOnly) return undefined;
    if (this.isToggle && this.toggleState.value && this.toggleText) {
      return this.toggleText;
    }
    return this.text??this.keys
  }

  getKeyIcon(): string | undefined {
    if (this.isToggle && this.toggleState.value && this.toggleIcon) {
      return this.toggleIcon;
    }
    return this.icon;
  }

  getKeyStyle() {
    if (this.isToggle && this.toggleState.value) {
      return this.toggleStyle;
    }
    return this.btnStyle;
  }

  reset() {
    this.toggleState.next(false);
  }
}
