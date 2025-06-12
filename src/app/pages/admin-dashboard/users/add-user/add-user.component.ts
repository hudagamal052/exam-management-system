import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TeacherService } from '../../../../services/teacher.service';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  userForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]),
      subject: new FormControl( [Validators.minLength(3)])
    }
  )
  profileImage: string | ArrayBuffer | null = 'https://i0.wp.com/e-quester.com/wp-content/uploads/2021/11/placeholder-image-person-jpg.jpg';
  subjects: { name: string, code: string }[] = [];
  
  subjectCodes: { [key: string]: string } = {
    math: 'MATH101',
    science: 'SCI201',
    history: 'HIST301',
    english: 'ENG401',
    art: 'ART501'
  };
  constructor(private teacherService: TeacherService){}

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();
      const requestBody = this.removeEmptyFields(formData);
      console.log(`update body : ${JSON.stringify(requestBody)}`);      
      this.teacherService.addStudent(requestBody).subscribe({
        next: value =>{
          console.log(`student added: ${value}`);
        },
        error: err => {
          console.log(`error: ${err}`);
        }
      });
    }else{
      console.log('not valid to add');
    }
  }
  addSubject(): void {
    const subjectControl = this.userForm.get('subject');
    if (subjectControl?.valid) {
      const subjectValue = subjectControl.value;
      this.subjects.push({
        name: this.getSubjectName(subjectValue),
        code: this.subjectCodes[subjectValue]
      });
      subjectControl.reset();
    }
  }

  removeSubject(index: number): void {
    this.subjects.splice(index, 1);
  }

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  private getSubjectName(value: string): string {
    const options = [
      { value: 'math', name: 'Mathematics' },
      { value: 'science', name: 'Science' },
      { value: 'history', name: 'History' },
      { value: 'english', name: 'English' },
      { value: 'art', name: 'Art' }
    ];
    return options.find(opt => opt.value === value)?.name || '';
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
