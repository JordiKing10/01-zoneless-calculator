import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'calculator-button',
  imports: [],
  templateUrl: './calculator-button.component.html',
  styleUrl: './calculator-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'border-r border-b border-indigo-400',
    '[class.w-1/4]': '!isDoubleSize()',
    '[class.w-2/4]': 'isDoubleSize()',
  },
})
export class CalculatorButtonComponent {
  public isPressed = signal(false);

  public onClick = output<string>();
  public contentValue = viewChild<ElementRef<HTMLButtonElement>>('button');

  public isCommand = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  public isDoubleSize = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  @HostBinding('class.w-2/4') get doubleSizeStyle() {
    return this.isDoubleSize();
  }

  handleClick() {
    if (!this.contentValue()?.nativeElement) {
      return;
    }

    const value = this.contentValue()!.nativeElement.innerText.trim();

    this.onClick.emit(value);
  }

  public keyboardPressedStyle(key: string) {
    if (!this.contentValue()) {
      return;
    }

    const value = this.contentValue()!.nativeElement.innerText.trim();

    if (value !== key) {
      return;
    }

    this.isPressed.set(true);

    setTimeout(() => {
      this.isPressed.set(false);
    }, 100);
  }
}
