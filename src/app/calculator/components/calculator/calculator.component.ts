import {
  ChangeDetectionStrategy,
  Component,
  viewChildren,
} from '@angular/core';
import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';

@Component({
  selector: 'calculator',
  imports: [CalculatorButtonComponent],
  templateUrl: './calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)',
  },
})
export class CalculatorComponent {
  public calculatorButtons = viewChildren(CalculatorButtonComponent);

  handleClick(key: string): void {
    console.log(`Button clicked: ${key}`);
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    const keyEquivalents: Record<string, string> = {
      Enter: '=',
      Backspace: 'C',
      '*': 'x',
      '/': '÷',
    };

    const key = event.key;
    const keyValue = keyEquivalents[key] || key;

    this.handleClick(keyValue);

    this.calculatorButtons().forEach((button) => {
      button.keyboardPressedStyle(keyValue);
    });
  }
}
