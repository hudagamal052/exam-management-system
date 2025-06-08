import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IProfile } from '../../models/iprofile';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements AfterViewInit {
  @ViewChild('crudModal', { static: false }) crudModal!: ElementRef;

  userProfileData: IProfile = {
    id: 1,
    name: 'John Elesha',
    email: 'john@example.com',
    phone: '015484521485',
    address: {
      street: 'welcome',
      city: 'Cairo',
      country: 'Egypt'
    },
    image: undefined
  };

  profileForm: FormGroup;
  selectedFileName: string | null = null;
  private selectedImage: string | null = null;

  constructor() {
    this.profileForm = new FormGroup({
      name: new FormControl(this.userProfileData.name, [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl(this.userProfileData.email, [
        Validators.required,
        Validators.email
      ]),
      phone: new FormControl(this.userProfileData.phone),
      street: new FormControl(this.userProfileData.address.street),
      city: new FormControl(this.userProfileData.address.city),
      country: new FormControl(this.userProfileData.address.country),
    });
  }

  ngAfterViewInit() {
    if (this.crudModal && this.crudModal.nativeElement) {
      setTimeout(() => {
        const modalElement = this.crudModal.nativeElement;
        if (typeof (window as any).Modal !== 'undefined') {
          const modal = new (window as any).Modal(modalElement);
          const toggleButtons = document.querySelectorAll('[data-modal-toggle="crud-modal"]');
          toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
              modal.toggle();
            });
          });
        } else {
          const toggleButtons = document.querySelectorAll('[data-modal-toggle="crud-modal"]');
          toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
              modalElement.classList.toggle('hidden');
              const overlay = document.querySelector('.flowbite-modal-overlay');
              if (overlay) {
                overlay.classList.toggle('hidden');
              }
            });
          });
        }
      }, 0);
    } else {
      console.warn('Modal element not found. Check template reference #crudModal.');
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFileName = input.files[0].name;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      this.selectedFileName = null;
      this.selectedImage = null;
    }
    input.value = '';
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      this.userProfileData = {
        ...this.userProfileData,
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || '',
        address: {
          street: formValue.street || '',
          city: formValue.city || '',
          country: formValue.country || ''
        },
        image: this.selectedImage || this.userProfileData.image
      };
      this.profileForm.patchValue({
        name: this.userProfileData.name,
        email: this.userProfileData.email,
        phone: this.userProfileData.phone,
        street: this.userProfileData.address.street,
        city: this.userProfileData.address.city,
        country: this.userProfileData.address.country
      });
      this.selectedImage = null;
      this.selectedFileName = null;
      const closeButton = document.querySelector('[data-modal-toggle="crud-modal"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  }
}