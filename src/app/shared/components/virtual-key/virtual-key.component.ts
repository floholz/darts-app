import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {KBCode} from "../../models/kb-code";
import {StyleClassModule} from "primeng/styleclass";

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

  @Output() onKeyPressed = new EventEmitter<KBCode>();

  onKey() {
    this.onKeyPressed.emit(this.keys);
  }

  getKeyLabel(): string | undefined {
    if (this.iconOnly) return undefined;
    return this.text??this.keys
  }
}
