import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableData } from '../admin-reservations/admin-reservations.component';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent {
  editedData: TableData;
  isDeleteDialogOpen: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableData
  ) {
    // Make a copy of the data to avoid modifying the original data until the form is submitted
    this.editedData = { ...data };
  }

  onCancel(): void {
    // Close the dialog without saving changes
    this.dialogRef.close();
  }

  onSubmit(): void {
    // Submit the edited data and close the dialog
    this.dialogRef.close(this.editedData);
    console.log(this.editedData);
  }

  onDelete(): void {
    // Open delete confirmation dialog
    this.isDeleteDialogOpen = true;
  }

  confirmDelete(): void {
    // Perform delete operation
    this.dialogRef.close('delete');
  }

  cancelDelete(): void {
    // Close delete confirmation dialog
    this.isDeleteDialogOpen = false;
  }
}
