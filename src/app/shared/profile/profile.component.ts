import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IProfile } from '../../models/iprofile';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    id: localStorage.getItem('user_id') || "1",
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: ''
    },
    image: undefined
  };

  profileForm: FormGroup;
  selectedFileName: string | null = null;
  selectedImage: File | null = null;

  constructor(private userService: UserService) {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      phone: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
    });
    this.loadUserProfile();
  }

  ngAfterViewInit() {
    if (this.crudModal && this.crudModal.nativeElement) {
      setTimeout(() => {
        const modalElement = this.crudModal.nativeElement;
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
      }, 0);
    } else {
      console.warn('Modal element not found. Check template reference #crudModal.');
    }
  }

  loadUserProfile(): void {
    const id = this.userProfileData.id || "1"; // Fallback to default if not set
    this.userService.getUserProfile(id).pipe(
      tap(profile => {
        this.userProfileData = profile;
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          street: profile.address.street,
          city: profile.address.city,
          country: profile.address.country
        });
      }),
      catchError(error => {
        console.error('Failed to load profile:', error);
        return throwError(() => new Error('Profile load failed'));
      })
    ).subscribe();
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFileName = input.files[0].name;
      this.selectedImage = input.files[0];
    } else {
      this.selectedFileName = null;
      this.selectedImage = null;
    }
    input.value = '';
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const profileData: Partial<IProfile> = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || '',
        address: {
          street: formValue.street || '',
          city: formValue.city || '',
          country: formValue.country || ''
        }
      };

      this.userService.updateUserProfile(this.userProfileData.id, profileData).pipe(
        tap(updatedProfile => {
          this.userProfileData = { ...this.userProfileData, ...updatedProfile };
          if (this.selectedImage) {
            this.userService.updateUserImage(this.userProfileData.id, this.selectedImage).pipe(
              tap(() => {
                if (this.selectedImage) {
                  this.userProfileData.image = URL.createObjectURL(this.selectedImage);
                }
              }),
              catchError(error => {
                console.error('Failed to update image:', error);
                return throwError(() => new Error('Image update failed'));
              })
            ).subscribe();
          }
          this.selectedImage = null;
          this.selectedFileName = null;
          const closeButton = document.querySelector('[data-modal-toggle="crud-modal"]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }),
        catchError(error => {
          console.error('Failed to update profile:', error);
          return throwError(() => new Error('Profile update failed'));
        })
      ).subscribe();
    }
  }
}