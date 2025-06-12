import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/user';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  teacher: Teacher = {} as Teacher;
  loading = true;
  now = new Date();
  activeExamsCount = 0;

  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  ProfileValidator = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.pattern(/^[0-9]{10,15}$/)]),
    location: new FormGroup({
      city: new FormControl('', [Validators.minLength(4)]),
      street: new FormControl('', [Validators.minLength(4)]),
      country: new FormControl('', [Validators.minLength(4)])
    })
  });

  constructor(private teacherService: TeacherService, private router: Router) { }

  ngOnInit(): void {
    this.loadTeacherProfile();
    this.loadTeacherImage();
  }

  loadTeacherImage() {
    console.log(`look for image ${this.teacher.image}`);
    
    if (this.teacher.image) {
      console.log('image exist');
      
      this.teacherService.getImage(this.teacher.image).subscribe(url => {
        console.log(`image url: ${url}`);
        this.previewImage = url;
      });
    }
  }

  loadTeacherProfile(): void {
    this.teacherService.getTeacherProfile().subscribe({
      next: (teacher) => {
        console.log(`image: ${teacher.image}`);

        this.teacher = teacher;
        
        this.loadTeacherImage();
        this.activeExamsCount = teacher.createdExams?.filter(
          exam => exam.endDate && new Date(exam.endDate) > this.now
        ).length || 0;

        this.ProfileValidator.patchValue({
          username: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          location: {
            city: teacher.location?.city || '',
            street: teacher.location?.street || '',
            country: teacher.location?.country || ''
          }
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load teacher profile', err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (this.selectedFile !== null) {
      this.teacherService.updateProfileImage(this.selectedFile).subscribe({
        next: value => {
          console.log('uploaded');

        }, error: (e) => {

        }
      });
    }
  }
  updateTeacher() {
    if (this.ProfileValidator.valid) {
      const formData = this.ProfileValidator.getRawValue();
      const requestBody = this.removeEmptyFields(formData);
      console.log(`update body : ${JSON.stringify(requestBody)}`);      
      this.teacherService.updateTeacherProfile(requestBody).subscribe({
        next: value =>{
          console.log(`profile updated: ${value}`);
        },
        error: err => {
          console.log(`error: ${err}`);
        }
      });
    }else{
      console.log('not valid to update');
      
    }
  }

  private removeEmptyFields(obj: any): any {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value === '' || value === null || value === undefined) {
        return acc;
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedCleaned = this.removeEmptyFields(value);
        if (Object.keys(nestedCleaned).length > 0) {
          acc[key] = nestedCleaned;
        }
      } else {
        if (key == "username"){
          acc['name'] = value;
        }else{
          acc[key] = value;
        }
      }
      return acc;
    }, {} as any);
  }
}