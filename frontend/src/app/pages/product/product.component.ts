import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import JsBarcode from 'jsbarcode';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

type ProductRow = {
  id: number;
  code: string; // XXXX-XXXX-XXXX-XXXX
};

// เงื่อนไขตามโจทย์: A-Z 0-9, 16 หลัก, รูปแบบ XXXX-XXXX-XXXX-XXXX
const CODE_PATTERN = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements AfterViewInit, OnInit, OnDestroy {
  codeCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(CODE_PATTERN)],
  });

  displayedColumns = ['id', 'code', 'barcode', 'action'];

  rows: ProductRow[] = [];
  private nextId = 1;

  private sub = new Subscription();

  @ViewChildren('barcodeSvg') barcodeSvgs!: QueryList<ElementRef<SVGSVGElement>>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Auto uppercase + auto format: พิมพ์ติดกัน 16 ตัว แล้วคั่น - ให้อัตโนมัติ
    this.sub.add(
      this.codeCtrl.valueChanges.subscribe((val) => {
        const formatted = this.formatCode39(val);

        // กัน loop: ถ้าค่าเหมือนเดิม ไม่ต้อง set ซ้ำ
        if (val !== formatted) {
          this.codeCtrl.setValue(formatted, { emitEvent: false });
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    // re-render whenever table rows change (svg list changes)
    this.barcodeSvgs.changes.subscribe(() => this.renderAllBarcodes());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  add(): void {
    if (this.codeCtrl.invalid) {
      this.codeCtrl.markAsTouched();
      return;
    }

    const code = this.codeCtrl.value.trim();
    this.rows = [{ id: this.nextId++, code }, ...this.rows];
    this.codeCtrl.setValue('');

    // render after DOM updates
    queueMicrotask(() => this.renderAllBarcodes());
  }

  async confirmDelete(row: ProductRow): Promise<void> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { code: row.code },
    });

    const ok = await ref.afterClosed().toPromise();
    if (ok) {
      this.rows = this.rows.filter((r) => r.id !== row.id);
      queueMicrotask(() => this.renderAllBarcodes());
    }
  }

  private renderAllBarcodes(): void {
    this.barcodeSvgs.forEach((el) => {
      const code = el.nativeElement.getAttribute('data-code');
      if (!code) return;

      try {
        JsBarcode(el.nativeElement, code, {
          format: 'CODE39',
          displayValue: false,
          height: 40,
          margin: 0,
        });
      } catch {
        // ignore render error
      }
    });
  }

  private formatCode39(input: string): string {
    // 1) เอาเฉพาะ A-Z 0-9, ทำเป็นตัวพิมพ์ใหญ่
    // 2) จำกัด 16 ตัว (ไม่รวม '-')
    const cleaned = (input || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 16);

    // 3) แบ่งเป็นชุดละ 4 แล้วคั่นด้วย '-'
    const parts = cleaned.match(/.{1,4}/g) ?? [];
    return parts.join('-');
  }

  getErrorText(): string {
    if (this.codeCtrl.hasError('required')) return 'กรุณากรอกรหัสสินค้า';
    if (this.codeCtrl.hasError('pattern')) {
      return 'รูปแบบต้องเป็น XXXX-XXXX-XXXX-XXXX (A-Z, 0-9) รวม 16 หลัก';
    }
    return 'ข้อมูลไม่ถูกต้อง';
  }
}
