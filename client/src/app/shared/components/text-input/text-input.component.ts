import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { JsonPipe, LowerCasePipe, NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'app-text-input',
  imports: [
    NgClass,
    NgIf,
    LowerCasePipe,
    JsonPipe
  ],
  templateUrl: './text-input.component.html',
  standalone: true,
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input') input!: ElementRef;
  @Input() type = 'text';
  @Input() label!: string;
  @Input() password!: string;
  currentType!: string;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  togglePassword() {
    this.currentType = this.currentType === 'password' ? 'text' : 'password';
  }

  ngOnInit(): void {
    this.currentType = this.type;
    const control = this.controlDir.control;
    if (control) {
      const validators = control.validator ? [control.validator] : [];
      const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
      control.setValidators(validators);
      control.setAsyncValidators(asyncValidators);
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  writeValue(obj: any): void {
    if (this.input) {
      this.input.nativeElement.value = obj || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: any) {
    if (this.controlDir.control) {
      this.onChange(event.target.value);
    }
  }

  onInputBlur() {
    if (this.controlDir.control) {
      this.controlDir.control.markAsTouched();
      this.controlDir.control.markAsDirty();
    }
    this.onTouched();
  }

  onChange: any = () => {};
  onTouched: any = () => {};
}
