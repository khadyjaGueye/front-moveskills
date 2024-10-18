import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-color-details-modal',
  standalone: true,
  imports: [],
  templateUrl: './color-details-modal.component.html',
  styleUrl: './color-details-modal.component.css'
})
export class ColorDetailsModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ColorDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

}
