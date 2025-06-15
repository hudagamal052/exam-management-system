import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
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
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('crudModal', { static: false }) crudModal!: ElementRef;

  userProfileData: IProfile = {
    id: "1",
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', country: '' },
    image: ''
  };

  profileForm: FormGroup;
  selectedFileName: string | null = null;
  selectedImage: File | null = null;

  constructor(private userService: UserService) {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
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

  loadUserProfile(): void {
    this.userService.getUserProfile().pipe(
      tap(profile => {
        console.log('Loaded Profile:', profile);
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

      this.userService.updateUserProfile(profileData).pipe(
        tap(updatedProfile => {
          console.log('Updated Profile:', updatedProfile);
          this.userProfileData = updatedProfile;
          this.profileForm.patchValue({
            name: this.userProfileData.name,
            email: this.userProfileData.email,
            phone: this.userProfileData.phone,
            street: this.userProfileData.address.street,
            city: this.userProfileData.address.city,
            country: this.userProfileData.address.country
          });

          // Handle image update separately with proper error handling
          if (this.selectedImage) {
            // Create object URL before the API call
            const tempImageUrl = URL.createObjectURL(this.selectedImage);

            this.userService.updateUserImage(this.selectedImage).pipe(
              tap((response) => {
                console.log('Image update response:', response);
                // Use the response image URL if available, otherwise use the temp URL
                if (response && response.imageUrl) {
                  this.userProfileData.image = response.imageUrl;
                } else {
                  this.userProfileData.image = tempImageUrl;
                }
              }),
              catchError(error => {
                console.error('Failed to update image:', error);
                // Revoke the temporary URL on error
                URL.revokeObjectURL(tempImageUrl);
                return throwError(() => new Error('Image update failed'));
              })
            ).subscribe({
              complete: () => {
                // Clean up
                this.selectedImage = null;
                this.selectedFileName = null;
              }
            });
          }

          // Close modal
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