import { Injectable, signal } from '@angular/core';

const NUMBERS = Array.from({ length: 10 }, (_, i) => i.toString());
const OPERATORS = ['+', '-', '*', '/', '÷', 'x', 'X'];
const SPECIAL_OPERATORS = ['+/-', 'C', '=', 'x', '÷', '%', 'Backspace', '.'];

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  public resultText = signal('0');
  public subResultText = signal('0');
  public lastOperator = signal('+');

  public constructNumber(value: string): void {
    if (![...NUMBERS, ...OPERATORS, ...SPECIAL_OPERATORS].includes(value)) {
      console.warn(`Valor inválido: ${value}`);
      return;
    }

    switch (value) {
      case '=':
        this.calculateResult();
        return;
      case 'C':
        this.resetCalculator();
        return;
      case 'Backspace':
        this.handleBackspace();
        return;
      case '+/-':
        this.toggleSign();
        return;
      case '.':
        this.handleDecimalPoint();
        return;
    }

    if (OPERATORS.includes(value)) {
      this.setOperator(value);
      return;
    }

    if (this.resultText().length >= 10) {
      console.log('Máximo número de caracteres alcanzado');
      return;
    }

    if (
      value === '0' &&
      (this.resultText() === '0' || this.resultText() === '-0')
    ) {
      return;
    }

    if (NUMBERS.includes(value)) {
      this.appendNumber(value);
    }
  }

  private resetCalculator(): void {
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperator.set('+');
  }

  private handleBackspace(): void {
    const current = this.resultText();
    if (current === '0') return;
    if (current.includes('-') && current.length === 2) {
      this.resultText.set('0');
      return;
    }
    if (current.length === 1) {
      this.resultText.set('0');
      return;
    }
    this.resultText.update((v) => v.slice(0, -1));
  }

  private setOperator(operator: string): void {
    this.lastOperator.set(operator);
    this.subResultText.set(this.resultText());
    this.resultText.set('0');
  }

  private handleDecimalPoint(): void {
    const current = this.resultText();
    if (current.includes('.')) return;
    if (current === '0' || current === '') {
      this.resultText.set('0.');
    } else {
      this.resultText.update((text) => text + '.');
    }
  }

  private toggleSign(): void {
    const current = this.resultText();
    if (current.startsWith('-')) {
      this.resultText.set(current.slice(1));
    } else {
      this.resultText.set('-' + current);
    }
  }

  private appendNumber(value: string): void {
    const current = this.resultText();
    if (current === '0' || current === '-0') {
      if (current.startsWith('-')) {
        this.resultText.set('-' + value);
      } else {
        this.resultText.set(value);
      }
    } else {
      this.resultText.update((text) => text + value);
    }
  }

  public calculateResult() {
    const number1 = parseFloat(this.subResultText());
    const number2 = parseFloat(this.resultText());
    const operator = this.lastOperator();

    let result = 0;
    switch (operator) {
      case '+':
        result = number1 + number2;
        break;
      case '-':
        result = number1 - number2;
        break;
      case '*':
      case 'x':
      case 'X':
        result = number1 * number2;
        break;
      case '/':
      case '÷':
        result = number1 / number2;
        break;
      default:
        result = number2;
    }

    this.resultText.set(result.toString());
    this.subResultText.set('0');
    this.lastOperator.set('+');
  }
}
