import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import JsBarcode from 'jsbarcode';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ProductApi, Product } from './product.api';

const DASHED_16 = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns = ['no', 'code', 'barcode', 'action'];
  loading = false;

  codeCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(DASHED_16)],
  });

  @ViewChild(MatTable) table!: MatTable<Product>;
  @ViewChildren('barcodeSvg') barcodeSvgs!: QueryList<ElementRef<SVGSVGElement>>;

  constructor(
    private api: ProductApi,
    private dialog: MatDialog,
  ) {
    this.codeCtrl.valueChanges.subscribe((v) => {
      const formatted = this.formatTyping(v ?? '');
      if (formatted !== v) this.codeCtrl.setValue(formatted, { emitEvent: false });
    });
  }

  ngAfterViewInit(): void {
    this.loadProducts();
    this.barcodeSvgs.changes.subscribe(() => this.refreshTableAndBarcode());
  }

  private refreshTableAndBarcode(): void {
    setTimeout(() => {
      this.table?.renderRows();
      this.renderBarcodes();
    }, 0);
  }

  loadProducts(): void {
    this.loading = true;
    this.api.list().subscribe({
      next: (res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        this.dataSource.data = [...items];
        this.loading = false;
        this.refreshTableAndBarcode();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  add(): void {
    if (this.codeCtrl.invalid || this.loading) return;

    const code = this.codeCtrl.value;
    this.loading = true;

    this.api.create(code).subscribe({
      next: (res) => {
        const created = res.data as Product | undefined;

        if (created) {
          this.dataSource.data = [...this.dataSource.data, created];
          this.refreshTableAndBarcode();
        } else {
          this.loadProducts();
        }

        this.codeCtrl.reset('');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  confirmDelete(row: Product): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการลบ',
        message: `ต้องการลบรายการ ${row.code} ใช่หรือไม่?`,
        confirmText: 'ลบ',
        cancelText: 'ยกเลิก',
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok === true) this.onDelete(row.id);
    });
  }

  onDelete(id: number): void {
    const prev = [...this.dataSource.data];

    this.dataSource.data = prev.filter((x) => x.id !== id);
    this.refreshTableAndBarcode();

    this.api.delete(id).subscribe({
      next: () => {},
      error: () => {
        this.dataSource.data = prev;
        this.refreshTableAndBarcode();
      },
    });
  }

  getErrorText(): string {
    if (this.codeCtrl.hasError('required')) return 'กรุณากรอกรหัสสินค้า';
    if (this.codeCtrl.hasError('pattern')) return 'รูปแบบต้องเป็น XXXX-XXXX-XXXX-XXXX';
    return '';
  }

  private formatTyping(input: string): string {
    const raw = (input || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 16);

    return raw
      .replace(/(.{4})/g, '$1-')
      .replace(/-$/, '')
      .slice(0, 19);
  }

  private renderBarcodes(): void {
    if (!this.barcodeSvgs) return;

    this.barcodeSvgs.forEach((ref) => {
      const el = ref.nativeElement;
      const code = el.getAttribute('data-code') || '';
      if (!DASHED_16.test(code)) return;

      JsBarcode(el, code, { format: 'CODE39', displayValue: true });
    });
  }
}
