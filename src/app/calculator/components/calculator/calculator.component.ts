import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChildren,
} from '@angular/core';
import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';
import { CalculatorService } from '@/calculator/services/calculator.service';

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
  private readonly calculatorService = inject(CalculatorService);

  public calculatorButtons = viewChildren(CalculatorButtonComponent);

  public resultText = computed(() => this.calculatorService.resultText());
  public subResultText = computed(() => this.calculatorService.subResultText());
  public lastOperatorText = computed(() =>
    this.calculatorService.lastOperator()
  );

  handleClick(key: string): void {
    console.log(`Button clicked: ${key}`);
    this.calculatorService.constructNumber(key);
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    const keyEquivalents: Record<string, string> = {
      Enter: '=',
      Delete: 'C',
      X: '*',
      x: '*',
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
