// error-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent {

  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ErrorPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    this.errorMessage = data.message;
  }

  close(): void {
    this.dialogRef.close();
  }
}
