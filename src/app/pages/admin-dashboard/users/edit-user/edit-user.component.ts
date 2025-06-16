import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../../../services/teacher.service';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule , FormsModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  student!: User;
  editUserForm = new FormGroup({
    username : new FormControl('', [Validators.required]),
    email : new FormControl('' ,[Validators.required, Validators.email]),
    phone : new FormControl('' ,[Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]),
    location: new FormGroup({
      city: new FormControl('', [Validators.minLength(4)]),
      street: new FormControl('', [Validators.minLength(4)]),
      country: new FormControl('', [Validators.minLength(4)])
    })
  });

  constructor(private router: ActivatedRoute, private teacherService: TeacherService, public route: Router){}

  ngOnInit(): void {
    console.log(`userId: ${ JSON.stringify(this.router.snapshot.paramMap)}`);
    
    this.getUserById(<string> this.router.snapshot.paramMap.get("userId"))
  }

  getUserById(id:string){
    this.teacherService.getUserById(id).subscribe({
      next: (value) => {
        console.log(`value: ${JSON.stringify(value)}`); 
        this.student = value;
        console.log(`student: ${JSON.stringify(this.student)}`);
        
        this.editUserForm.patchValue({
          username: value.name,
          email: value.email,
          phone: value.phone,
          location: {
            city: value.location.city,
            street: value.location.street,
            country: value.location.country
          }
        });
      },
      error: (e) => {
        console.error('Error fetching user: ', e);
      }
    });
  }

  onSubmit(){
    console.log(`editValues: ${JSON.stringify(this.editUserForm.value)}`);
    
    if (this.editUserForm.valid) {
      const formData = this.editUserForm.value;
      const cleanedData = this.removeEmptyFields(formData);
      cleanedData['name'] = cleanedData['username'];
      
      const userId = this.router.snapshot.paramMap.get("userId");
      console.log(`userId: ${userId}`);
      
      
      if (userId) {
        this.teacherService.updateUser(userId, cleanedData).subscribe({
          next: (response) => {
            console.log('User updated successfully:', response);
            this.route.navigate(['/admin/users']);
          },
          error: (error) => {
            console.error('Error updating user:', error);
          }
        });
      }
    }else{
      console.log(`not valid: ${this.editUserForm.errors}`);
      
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
        acc[key] = value;
      }
      return acc;
    }, {} as any);
  }

  cancelEdit() {
    this.route.navigate(['/admin/users']);
  }
}
